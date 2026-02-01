import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Kullanıcı adı zorunludur"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Şifre zorunludur"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
