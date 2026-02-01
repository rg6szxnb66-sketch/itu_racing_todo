"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input"; // Inptlar için Hazır Parça
import Button from "@/components/Button"; // Butonlar için Hazır Parça

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-green-900 rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold font-mono text-center mb-8 text-green-500 tracking-wider">
          FiniList <span className="text-white font-medium">Kayıt Ol</span>
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-200 text-sm rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500 text-green-200 text-sm rounded">
            Kayıt Başarılı! Yönlendiriliyorsunuz...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Kullanıcı Adı"
            type="text"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Şifre Inputu */}
          <div>
            <Input
              label="Şifre"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-gray-300 mt-1">
              *En az 8 karakter, büyük harf ve sembol içermeli.
            </p>
          </div>

          <Button text="KAYIT OL" type="submit" />
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Zaten hesabın var mı?{" "}
          <a
            href="/login"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
}
