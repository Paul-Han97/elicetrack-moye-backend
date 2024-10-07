import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document<mongoose.Types.ObjectId> {
  username: string;
  email: string;
  password: string;
  registerType: "normal" | "google";
  socialId: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: { type: String, minlength: 6 },
    registerType: {
      type: String,
      enum: ["normal", "google"],
      default: "normal",
    },
    socialId: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (this.password && (this.isNew || this.isModified("password")))
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
