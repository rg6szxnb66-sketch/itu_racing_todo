import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Log from "@/models/Log";
import User from "@/models/User"; // Kullanıcı adlarını görmek için User modelini ekledik

// ADMIN İÇİN LOGLARI GETİR (GET)

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");

  // Admin kontrolü
  if (!adminId) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  // İstek yapan kişinin admin olup olmadığını kontrol eder.
  const requester = await User.findById(adminId);

  if (!requester || requester.role !== "admin") {
    return NextResponse.json(
      { error: "Admin yetkisi gerekli" },
      { status: 403 },
    );
  }

  // Tüm logları en yeniden en eskiye çekiyoruz
  // .populate('userId', 'username') diyerek sadece ID değil,
  // o kullanıcının ismini de çekiyoruz ki logda "Kullanıcı_123" yerine "Ahmet" yazsın.
  const logs = await Log.find({})
    .populate("userId", "username")
    .sort({ timestamp: -1 });

  return NextResponse.json(logs);
}

// SİLME İŞLEMİ (DELETE)

export async function DELETE(req: Request) {
  await dbConnect();

  // Güvenlik: Sadece admin silebilir
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");
  const requester = await User.findById(adminId);

  if (!requester || requester.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
  }

  // TÜM LOGLARI SİL
  await Log.deleteMany({});

  return NextResponse.json({ message: "Tüm loglar temizlendi" });
}
