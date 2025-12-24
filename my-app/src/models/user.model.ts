import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  image?: string;
  role: "user" | "admin" | "deliveryBoy";
  location: {
    type: {
      type: string;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: number[];
      default: number[];
    };
  };
  socketId?: string | null;
  isOnline?: boolean;
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
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy"],
      default: "user",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: "2dsphere" });

const UserModel = mongoose.models?.User || mongoose.model("User", userSchema);
export default UserModel;
