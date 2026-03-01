import mongoose from "mongoose";

interface IDelivery {
  _id?: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  totalDeliveryBoys: mongoose.Types.ObjectId[];
  assignedDeliveryBoy: mongoose.Types.ObjectId | null;
  status: "broadcasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliverySchema = new mongoose.Schema<IDelivery>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    totalDeliveryBoys: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["broadcasted", "assigned", "completed"],
      default: "broadcasted",
    },
    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const deliveryModel =
  mongoose.models?.deliveryModel || mongoose.model("Delivery", deliverySchema);
export default deliveryModel;
