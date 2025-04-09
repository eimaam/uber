import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI;



async function connectDB() {
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }

  console.log("Connecting to MongoDB...");

  try {
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, { connectTimeoutMS: 15000 });
    }

    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB is already connected');
      return;
    }

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Optional: Handle process termination signals
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    // Optional: Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      console.error('Uncaught Exception:', error);
      await mongoose.connection.close();
      process.exit(1);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }


  return mongoose.connection;
  

  

}



export default connectDB;