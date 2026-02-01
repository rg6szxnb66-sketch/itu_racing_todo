import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  actionType: {
    type: String, // 'CREATE', 'UPDATE', 'DELETE'
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Log || mongoose.model("Log", LogSchema);
