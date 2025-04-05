import mongoose from "mongoose";

// Define the interface for our cached mongoose instance
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// We need to use var in the global declaration - this is a special case
// where 'var' is actually correct. We'll disable ESLint for this line only.
/* eslint-disable no-var */
declare global {
  var mongoose: MongooseCache | undefined;
}
/* eslint-enable no-var */

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

const cached: MongooseCache = globalThis.mongoose || { conn: null, promise: null };

// Update global mongoose only if it's not already set
if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;