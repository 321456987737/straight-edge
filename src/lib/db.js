import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
export async function dbConnect() {
   if (cached.conn) {
     return cached.conn;
   }
   
   if (!cached.promise) {
      const opts = {
         bufferCommands: true,
         maxPoolSize: 10,
      }
      console.log("Creating new database connection...");
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("Database connected successfully");
        return mongoose.connection;
      });
   }
   
   try{
      cached.conn = await cached.promise;
   } catch (error) {
      console.error("Database connection failed:", error);
      cached.promise = null;
      throw new Error(`Database connection failed: ${error.message}`);
   }
   
   return cached.conn;
}