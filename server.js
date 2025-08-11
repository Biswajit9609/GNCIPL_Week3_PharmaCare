import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import medicineRoutes from './routes/medicineRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

// Routes
app.use('/medicines', medicineRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});