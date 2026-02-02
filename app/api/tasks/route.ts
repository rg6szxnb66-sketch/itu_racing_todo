import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import Log from "@/models/Log"; 

// 1. GÖREVLERİ GETİRME
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Kullanıcı ID gerekli" },
      { status: 400 },
    );
  }

  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

// 2. YENİ GÖREV EKLEME
export async function POST(req: Request) {
  await dbConnect();
  const { userId, content } = await req.json();

  if (!userId || !content) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  const newTask = await Task.create({ userId, content });

  // ✅ LOG EKLE: CREATE
  await Log.create({
    userId,
    actionType: "CREATE",
    details: `Yeni görev eklendi: "${content}"`,
  });

  return NextResponse.json(newTask, { status: 201 });
}

// 3. GÖREV SİL (DELETE)
export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json({ error: "ID Gerekli" }, { status: 400 });
  }


  const task = await Task.findById(taskId);
  if (task) {
    await Log.create({
      userId: task.userId,
      actionType: "DELETE",
      details: `Görev silindi: "${task.content}"`,
    });
    await Task.findByIdAndDelete(taskId);
  }

  return NextResponse.json({ message: "Silindi" });
}

// 4. GÖREV GÜNCELLEME
export async function PATCH(req: Request) {
  await dbConnect();
  const { taskId, content, isCompleted } = await req.json();

  if (!taskId) {
    return NextResponse.json({ error: "ID Gerekli" }, { status: 400 });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { content, isCompleted },
    { new: true },
  );

  if (updatedTask) {
    //  LOG EKLEME VE UPDATE
    await Log.create({
      userId: updatedTask.userId,
      actionType: "UPDATE",
      details: `Görev güncellendi/tamamlandı: "${updatedTask.content}"`,
    });
  }

  return NextResponse.json(updatedTask);
}
