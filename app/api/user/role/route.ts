import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ role: "user" });

  const user = await User.findById(userId);
  // Veritabanındaki rolü döndür (admin mi user mı?)
  return NextResponse.json({ role: user?.role || "user" });
}
