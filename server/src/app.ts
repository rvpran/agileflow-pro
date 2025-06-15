import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(helmet());

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AgileFlow Pro API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;