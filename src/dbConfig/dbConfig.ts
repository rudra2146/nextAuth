import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    // ⛳️ Add this debug log
    console.log("🧪 MONGO_URI from env:", mongoUri);

    if (!mongoUri) {
      throw new Error("❌ MONGO_URI is not defined in .env.local");
    }

    // Add timeout settings here
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,  // Timeout value in ms
      socketTimeoutMS: 45000,          // Timeout for socket in ms
    });
    

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    connection.on("error", (err) => {
      console.log("❌ MongoDB connection error, make sure DB is up and running →", err);
      process.exit(1);
    });
  } catch (error) {
    console.log("🚨 Something went wrong in connecting DB");
    console.log(error);
  }
}
