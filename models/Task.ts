import mongoose from "mongoose";

// Eğer daha önce tanımlandıysa hata vermemesi için kontrol mekanizması Next.js'de önemlidir
const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    // Görev oluşturulma tarihi
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
