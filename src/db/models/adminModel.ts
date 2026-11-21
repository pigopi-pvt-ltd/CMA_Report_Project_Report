import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  resetOtp?: string;
  resetOtpExpires?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "admins",
  }
);

export const AdminModel: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel;
