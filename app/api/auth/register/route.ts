import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

//  GÜVENLİK DUVARI (ZOD ŞEMASI)
const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Kullanıcı adı en az 3 karakter olmalı" }),
  password: z
    .string()
    .min(8, { message: "Parola en az 8 karakter olmalı" }) // Uzunluk kuralı
    .regex(/[A-Z]/, { message: "Parola en az 1 büyük harf içermeli" }) // Büyük harf kuralı
    .regex(/[0-9]/, { message: "Parola en az 1 rakam içermeli" }) // Rakam kuralı
    .regex(/[^a-zA-Z0-9]/, {
      message: "Parola en az 1 özel karakter (@,!,? vb.) içermeli",
    }), // Sembol kuralı
});

export async function POST(req: Request) {
  try {
    // 1. Veritabanına Bağlanma
    await dbConnect();

    // 2. Gelen veriyi alma
    const body = await req.json();

    // 3. DATA KONTROLÜ
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errorFormatted = validation.error.format();

      // Hatanın nerede olduğunu bulma
      const errorMessage =
        errorFormatted.username?._errors[0] ||
        errorFormatted.password?._errors[0] ||
        "Geçersiz veri girişi.";

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { username, password } = validation.data;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten alınmış." },
        { status: 400 },
      );
    }

    // 5. Hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Kayıt İşlemi
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu.", user: newUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 },
    );
  }
}
