import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: 'Drmatch', // Optional if already in your URI
    });
  } catch (err) {
    console.error(' MongoDB connection error:', err);
  }
};

export default connectDB;
