import mongoose from "mongoose";

// connectDB establishes a connection to MongoDB Atlas using the URI
// stored in our environment variables. Keeping this logic separate
// from index.js follows the Single Responsibility Principle.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // If the database connection fails, there is no point running
    // the server — exit the process with a failure code (1).
    process.exit(1);
  }
};

export default connectDB;
