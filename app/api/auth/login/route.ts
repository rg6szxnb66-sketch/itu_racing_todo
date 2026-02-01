import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Kullanıcı adı gereklidir." }),
  password: z.string().min(1, { message: "Şifre gereklidir." }),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Güvenlik Kontrolü - Giriş verilerini doğrula
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const errorFormatted = validation.error.format();

      const errorMessage =
        errorFormatted.username?._errors[0] ||
        errorFormatted.password?._errors[0] ||
        "Geçersiz veri girişi.";

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Başarılıysa veriyi al
    const { username, password } = validation.data;

    // Username ile kullanıcıyı bulma.
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 401 },
      );
    }

    // Şifre Karşılaştırma (Hash kontrolü)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Şifre hatalı!" }, { status: 401 });
    }

    // Başarılı
    return NextResponse.json(
      {
        message: "Giriş Başarılı!",
        user: {
          id: user._id,
          username: user.username, // Email yerine username dönüyoruz
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login Hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 },
    );
  }
}
