"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { check } from "zod";

interface TaskType {
  _id: string;
  content: string;
  isCompleted: boolean;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [newTask, setNewTask] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // DÜZENLEME İÇİN STATE'LER
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUserId(storedUser);
      fetchTasks(storedUser);
      checkUserRole(storedUser);
    }
  }, []);

  const checkUserRole = async (id: string) => {
    try {
      const res = await fetch(`/api/user/role?userId=${id}`);

      if (!res.ok) {
        console.error("API hatası: Rol alınamadı");
        return;
      }

      const data = await res.json();

      // 🔍 DEBUG: Tarayıcı konsolunda (F12) ne yazdığını kontrol et
      console.log("Veritabanından dönen rol:", data.role);

      setUserRole(data.role);
    } catch (error) {
      console.error("Rol kontrolü sırasında ağ hatası:", error);
    }
  };

  const fetchTasks = async (id: string) => {
    const res = await fetch(`/api/tasks?userId=${id}`);
    const data = await res.json();
    setTasks(data);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content: newTask }),
    });

    if (res.ok) {
      setNewTask("");
      fetchTasks(userId!);
    }
  };

  // GÜNCELLEME FONKSİYONU
  const handleUpdate = async (taskId: string, fields: Partial<TaskType>) => {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, ...fields }),
    });

    if (res.ok) {
      setEditingId(null);
      fetchTasks(userId!);
    }
  };

  const handleDelete = async (taskId: string) => {
    await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    fetchTasks(userId!);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Üst Başlık */}
        <div className="flex justify-between items-center mb-10 border-b border-green-900 pb-4">
          <h1 className="text-4xl font-mono text-green-500 font-bold tracking-widest">
            FiniList_
          </h1>
          <div className="flex gap-4 items-center">
            {userRole === "admin" && ( //ADMİN'İN OYUN ALANI :)
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-red-400 font-mono animate-pulse">
                  ADMIN_MODU_ETKİN: Hoş Geldin Onur...
                </span>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => router.push("/admin")}
                    className="text-[15px] text-green-500 hover:text-green-400 text-sm font-bold font-mono transition-colors"
                  >
                    [YÖNETİCİ PANELİ]
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 text-sm font-mono transition-colors"
            >
              [ÇIKIŞ YAP]
            </button>
          </div>
        </div>

        {/* Görev Ekleme Formu */}
        <form onSubmit={handleAddTask} className="mb-12 flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Yeni Görev"
              type="text"
              placeholder="Yeni görevi buraya yazın..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
          <div className="mb-4 w-32">
            <Button text="EKLE" type="submit" />
          </div>
        </form>

        {/* Görev Listesi */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-900 rounded-xl">
              <span className="text-4xl mb-4 animate-bounce">📥</span>
              <p className="text-green-500 font-mono text-lg tracking-widest text-center px-4">
                {">"} SİSTEM_BEKLEMEDE: Hiç görev eklenmemiş...
              </p>
              <br />
              <p className="font-mono text-gray-400 text-center px-6">
                <span className="text-gray-400 text-sm italic">
                  [ Başlamak için yukarıdan görev girişi yapın ]
                </span>
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="group flex justify-between items-center p-5 bg-gray-900/50 border-l-4 border-l-green-900 border-y border-r border-gray-800 rounded-r-lg transition-all duration-300 hover:border-l-green-500 hover:bg-gray-800 hover:translate-x-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] overflow-hidden"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="text-green-800 font-bold flex-shrink-0">
                    {">"}
                  </span>

                  {editingId === task._id ? (
                    <input
                      autoFocus
                      className="bg-black border-b border-green-500 text-white font-mono outline-none w-full"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onBlur={() =>
                        handleUpdate(task._id, { content: editContent })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleUpdate(task._id, { content: editContent })
                      }
                    />
                  ) : (
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        onClick={() => {
                          setEditingId(task._id);
                          setEditContent(task.content);
                        }}
                        className="text-gray-200 font-mono text-lg cursor-pointer hover:text-green-400 transition-colors break-all whitespace-normal"
                      >
                        {task.content}
                      </span>

                      <span className="text-[11px] text-gray-400 font-mono ml-0 mt-1">
                        [ TARİH:{" "}
                        {new Date(task.createdAt).toLocaleString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}{" "}
                        |{" "}
                        {new Date(task.createdAt).toLocaleString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        ]
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-700 hover:text-red-500 font-black px-3 py-1 ml-4 flex-shrink-0 rounded-md border border-transparent hover:border-red-500/50 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  [SİL]
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
