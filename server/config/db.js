const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_PRODUCTION); // <-- fixed typo
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection error", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
