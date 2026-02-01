"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LogType {
  _id: string;
  actionType: "CREATE" | "UPDATE" | "DELETE";
  userId: { username: string };
  details: string;
  timestamp: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const storedId = localStorage.getItem("userId");

    if (!storedId) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`/api/admin/logs?adminId=${storedId}`);

      if (res.status === 403 || res.status === 401) {
        alert(
          "YETKİSİZ ERİŞİM: Bu alana sadece sistem yöneticileri erişebilir.",
        );
        router.push("/");
        return;
      }

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Loglar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };
  const clearLogs = async () => {
    if (
      !confirm(
        "Tüm sistem geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!",
      )
    )
      return;

    const adminId = localStorage.getItem("userId");
    const res = await fetch(`/api/admin/logs?adminId=${adminId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setLogs([]); // Ekranı hemen temizle
      alert("Sistem logları başarıyla imha edildi.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center border-b border-green-900 pb-4 mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter">
              [SİSTEM_DENETİM_PANELİ] v1.0
            </h1>
            <h2 className="text-m text-green-400">
              FiniList by <b>Onur Yüksek</b>
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={clearLogs}
              className="text-red-600 text-sm border border-red-700 px-3 py-1 hover:bg-red-700/20 transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:scale-[1.01] active:scale-95 active:shadow-none hover:animate-pulse"
            >
              SİSTEM_GEÇMİŞİNİ_TEMİZLE
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-sm border border-green-900 px-3 py-1 hover:bg-green-900/30 transition-all"
            >
              {"<"} ANA_SAYFAYA_DÖN
            </button>
          </div>
        </div>

        {loading ? (
          <p className="animate-pulse">VERİLER_TARANIYOR...</p>
        ) : (
          <div className="space-y-2">
            {/* Başlık satırı: Genişlikler içerik satırı ile aynı olmalı */}
            <div className="grid grid-cols-[160px_120px_100px_1fr] gap-6 text-green-800 border-b border-green-900 pb-2 text-xs">
              <span>ZAMAN_DAMGASI</span>
              <span>KULLANICI</span>
              <span>İŞLEM_TİPİ</span>
              <span>DETAYLAR</span>
            </div>

            {logs.map((log) => (
              <div
                key={log._id}
                // grid-cols-[...] ile sütun genişliklerini sabitledik, detaylara kalan boşluğu (1fr) verdik
                className="grid grid-cols-[160px_120px_100px_1fr] gap-6 py-3 border-b border-gray-900 text-sm hover:bg-green-900/10 transition-colors items-start"
              >
                <span className="text-gray-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString("tr-TR")}
                </span>
                <span className="text-blue-400 shrink-0">
                  @{log.userId?.username || "Bilinmiyor"}
                </span>
                <span
                  className={`font-bold shrink-0 ${
                    log.actionType === "DELETE"
                      ? "text-red-500"
                      : log.actionType === "CREATE"
                        ? "text-green-400"
                        : "text-yellow-500"
                  }`}
                >
                  {log.actionType}
                </span>
                {/* truncate kaldırıldı, break-words ve whitespace-normal eklendi */}
                <span className="text-gray-300 break-words whitespace-normal leading-relaxed">
                  {log.details}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
