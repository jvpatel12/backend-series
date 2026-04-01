import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db connection successfull");
  } catch (error) {
    console.log("mongo db connetion error" + error);
    (process, exit(1));
  }
};

export default connectDB;
