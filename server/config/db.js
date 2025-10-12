import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log("Database connected successfully");
    } catch (err) {
        console.log("MONGODB connection FAILED");
        throw err;
    }
};

export default connectDB;
