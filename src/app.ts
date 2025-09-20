import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic request logger middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Mini-Trello API is running!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      boards: '/boards',
      tasks: '/tasks',
      documentation: 'See README.md for API documentation'
    }
  });
});

// Routes
app.use('/boards', boardRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: any) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Mini-Trello API server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('HTTP server closed');
  });
});

export default app;