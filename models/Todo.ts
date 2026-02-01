import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // User tablosunun ID'sini tutar
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
); // Oluşturulma tarihini otomatik kaydeder

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
