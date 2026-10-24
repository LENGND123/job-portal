import mongoose from "mongoose";

mongoose.set("strictQuery", true);

let connecting;

export function connectDb() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(new Error("MONGO_URI is not set."));
  }
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 5 })
      .then(() => {
        console.log("Connected to MongoDB.");
      })
      .catch((error) => {
        connecting = null;
        throw error;
      });
  }
  return connecting;
}
