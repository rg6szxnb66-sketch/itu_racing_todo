import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Lütfen .env.local dosyasına MONGODB_URI ekleyin.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4,
    };

    console.log("⏳ Veritabanına bağlanılıyor...");

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("VERİTABANINA BAĞLANDI!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("BAĞLANTI HATASI:", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
