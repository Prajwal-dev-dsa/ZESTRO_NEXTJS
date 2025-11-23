import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL as string;

if (!MONGO_DB_URL) {
  throw new Error("Please provide MONGO_DB_URL in the environment variables");
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

async function ConnectDB() {
  if (cache.conn) {
    return cache.conn;
  }
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGO_DB_URL)
      .then((conn) => conn.connection);
  }
  try {
    const conn = await cache.promise;
    return conn;
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
}

export default ConnectDB;
