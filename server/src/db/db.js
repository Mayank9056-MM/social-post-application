import mongoose from "mongoose";
import logger from "../logger.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGO db URI is not found in evn variables");
    }

    mongoose.connection.on("connected", () => {
      logger.info("🟢 MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("🔴 MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("🟡 MongoDB disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

export const getDBStatus = () => {
  const readyState = mongoose.connection.readyState;
  return readyState;
};
