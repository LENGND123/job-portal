import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "recruiter"], required: true },
    profile: {
      bio: { type: String, default: "" },
      skills: { type: [String], default: [] },
      resume: { type: String, default: "" },
      resumeOriginalName: { type: String, default: "" },
      profilePhoto: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

function hidePassword(_doc, ret) {
  delete ret.password;
  return ret;
}

userSchema.set("toJSON", { transform: hidePassword });
userSchema.set("toObject", { transform: hidePassword });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

export const User = mongoose.model("User", userSchema);
