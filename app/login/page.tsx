"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input"; // Input için hazır parça
import Button from "@/components/Button"; // Buton için hazır parça

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        localStorage.setItem("userId", data.user.id); // Kullanıcı ID'sini localStorage'da sakla.
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
        {/* Başlık - Hacker Temalı ve Yeşil */}
        <h2 className="text-3xl font-bold font-mono text-center mb-8 text-green-500 tracking-wider">
          FiniList <span className="text-white font-medium">Giriş</span>
        </h2>

        {/* Hata Mesajı Kutusu */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-200 text-sm rounded animate-pulse">
            {error}
          </div>
        )}

        {/* Başarı Mesajı Kutusu */}
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500 text-green-200 text-sm rounded">
            Giriş Başarılı! Yönlendiriliyorsunuz...
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Kullanıcı Adı"
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button text="GİRİŞ YAP" type="submit" />
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Hesabın yok mu?{" "}
          <a
            href="/register"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
}
