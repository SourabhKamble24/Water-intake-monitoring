import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import waterRoutes from './routes/water';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.use('/api/auth', authRoutes);
app.use('/api/water', waterRoutes);

app.get('/', (req, res) => {
  res.send('HydroTrack API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
