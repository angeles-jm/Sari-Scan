import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: String, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: String, default: 0 },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  createdAt: { type: Date, default: new Date() },
});

// Use ES module export
export default mongoose.model("User", userSchema);
