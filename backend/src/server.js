import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import waterRoutes from './routes/water.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({
  limit: '5mb'
}));
app.use(express.urlencoded({
  limit: '5mb',
  extended: true
}));
const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/water', waterRoutes);
app.get('/', (req, res) => {
  res.send('HydroTrack API is running');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});