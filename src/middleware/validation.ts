import { Request, Response, NextFunction } from 'express';
import { BoardService } from '../services/boardService';

// Middleware to validate if a board exists
export const validateBoardExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boardId = parseInt(req.params.boardId);

    if (isNaN(boardId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid board ID',
      });
    }

    const boardExists = await BoardService.boardExists(boardId);
    
    if (!boardExists) {
      return res.status(404).json({
        success: false,
        error: 'Board not found',
      });
    }

    // Add boardId to request for easy access in controllers
    (req as any).boardId = boardId;
    next();
  } catch (error) {
    console.error('Error validating board:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Middleware to log request details
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);
  
  // Log request body for POST/PUT requests (but not for sensitive data)
  if ((method === 'POST' || method === 'PUT') && req.body) {
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(req.body, null, 2));
  }
  
  next();
};

// Middleware to validate task status
export const validateTaskStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  
  if (status) {
    const validStatuses = ['Todo', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`,
      });
    }
  }
  
  next();
};