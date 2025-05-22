import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database:', connect.connection.host);
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
}
;