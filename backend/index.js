import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoute from './routes/upload.js';

// Load .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes//
app.use('/upload', uploadRoute);

// Health check
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
