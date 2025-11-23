import mongoose from "mongoose";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: "user" | "admin" | "deliveryBoy";
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models?.User || mongoose.model("User", userSchema);
export default UserModel;
