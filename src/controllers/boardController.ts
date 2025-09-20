import { Request, Response } from 'express';
import { BoardService, CreateBoardData, UpdateBoardData } from '../services/boardService';

export class BoardController {
  // GET /boards - Get all boards
  static async getAllBoards(req: Request, res: Response) {
    try {
      const boards = await BoardService.getAllBoards();
      res.json({
        success: true,
        data: boards,
        count: boards.length,
      });
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch boards',
      });
    }
  }

  // GET /boards/:id - Get board by ID
  static async getBoardById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid board ID',
        });
      }

      const board = await BoardService.getBoardById(id);
      
      if (!board) {
        return res.status(404).json({
          success: false,
          error: 'Board not found',
        });
      }

      res.json({
        success: true,
        data: board,
      });
    } catch (error) {
      console.error('Error fetching board:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch board',
      });
    }
  }

  // POST /boards - Create new board
  static async createBoard(req: Request, res: Response) {
    try {
      const { name } = req.body as CreateBoardData;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Board name is required',
        });
      }

      const board = await BoardService.createBoard({ name: name.trim() });
      
      res.status(201).json({
        success: true,
        data: board,
        message: 'Board created successfully',
      });
    } catch (error) {
      console.error('Error creating board:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create board',
      });
    }
  }

  // PUT /boards/:id - Update board
  static async updateBoard(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body as UpdateBoardData;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid board ID',
        });
      }

      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Board name is required',
        });
      }

      // Check if board exists
      const boardExists = await BoardService.boardExists(id);
      if (!boardExists) {
        return res.status(404).json({
          success: false,
          error: 'Board not found',
        });
      }

      const board = await BoardService.updateBoard(id, { name: name.trim() });
      
      res.json({
        success: true,
        data: board,
        message: 'Board updated successfully',
      });
    } catch (error) {
      console.error('Error updating board:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update board',
      });
    }
  }

  // DELETE /boards/:id - Delete board
  static async deleteBoard(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid board ID',
        });
      }

      // Check if board exists
      const boardExists = await BoardService.boardExists(id);
      if (!boardExists) {
        return res.status(404).json({
          success: false,
          error: 'Board not found',
        });
      }

      await BoardService.deleteBoard(id);
      
      res.json({
        success: true,
        message: 'Board and all its tasks deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete board',
      });
    }
  }
}