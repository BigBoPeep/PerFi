import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not defined");

  if (mongoose.connection.readyState === 1) {
    console.log("Reusing connection");
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log("Connection in progress, waiting...");
    await mongoose.connection.asPromise();
    return;
  }

  try {
    console.log("Creating connection...");
    await mongoose.connect(uri, {
      maxPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("Connected!");
  } catch (error) {
    console.error("Connection failed:", error);
    throw error;
  }
};
