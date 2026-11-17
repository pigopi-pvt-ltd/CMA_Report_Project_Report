import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  planId: "project_plan" | "combo_plan";
  planName: string;
  amount: number;
  status: "active" | "expired" | "cancelled" | "pending";
  startDate: Date;
  endDate: Date;
  txnid: string;
  paymentId?: string;
  payuResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, index: true },
    planId: {
      type: String,
      enum: ["project_plan", "combo_plan"],
      required: true,
    },
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true, index: true },
    txnid: { type: String, required: true, unique: true },
    paymentId: { type: String },
    payuResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
