import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI not defined");
  }

  await mongoose.connect(uri, { maxPoolSize: 3 });
};
