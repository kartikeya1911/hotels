const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
// This function connects to the MongoDB database using Mongoose.
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_hub');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 