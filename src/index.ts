import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const PORT = 5000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MongoDB connection string is not defined in the .env file.');
    process.exit(1);
}

mongoose.connect(mongoURI, {
  
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});

const db = mongoose.connection;

db.on("error", (error) => {
    console.error('MongoDB error:', error);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
