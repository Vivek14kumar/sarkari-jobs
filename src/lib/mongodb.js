import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI; // correct env variable
  if (!uri) throw new Error("MONGODB_URI is not defined");

  try {
    await mongoose.connect(uri, {
      dbName: "sarkari-jobs",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error; // throw so API route gets the 500 error properly
  }
};

/*import mongoose from "mongoose"; 
let isConnected = false;
 export const connectToDB = async () => { if (isConnected) return;
   try { await mongoose.connect(process.env.MONGO_URI,
     { dbName: "sarkari-jobs", });
      isConnected = true; 

      console.log("✅ MongoDB connected");
     } catch (error) 
     { 
      console.error("❌ MongoDB connection error:", error);
} };*/