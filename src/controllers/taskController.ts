import { Request, Response } from 'express';
import { TaskService, CreateTaskData, UpdateTaskData } from '../services/taskService';
import { BoardService } from '../services/boardService';

export class TaskController {
  // POST /boards/:boardId/tasks - Create new task in a board
  static async createTask(req: Request, res: Response) {
    try {
      const boardId = parseInt(req.params.boardId);
      const { title, description, status } = req.body as Omit<CreateTaskData, 'boardId'>;

      if (isNaN(boardId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid board ID',
        });
      }

      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Task title is required',
        });
      }

      const taskStatus = status || 'Todo';
      if (!TaskService.isValidStatus(taskStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Valid statuses are: ${TaskService.getValidStatuses().join(', ')}`,
        });
      }

      // Check if board exists
      const boardExists = await BoardService.boardExists(boardId);
      if (!boardExists) {
        return res.status(404).json({
          success: false,
          error: 'Board not found',
        });
      }

      const task = await TaskService.createTask({
        title: title.trim(),
        description: description?.trim(),
        status: taskStatus,
        boardId,
      });

      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task',
      });
    }
  }

  // GET /boards/:boardId/tasks - Get all tasks for a board
  static async getTasksByBoard(req: Request, res: Response) {
    try {
      const boardId = parseInt(req.params.boardId);

      if (isNaN(boardId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid board ID',
        });
      }

      // Check if board exists
      const boardExists = await BoardService.boardExists(boardId);
      if (!boardExists) {
        return res.status(404).json({
          success: false,
          error: 'Board not found',
        });
      }

      const tasks = await TaskService.getTasksByBoardId(boardId);

      res.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks',
      });
    }
  }

  // GET /tasks/:id - Get task by ID
  static async getTaskById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid task ID',
        });
      }

      const task = await TaskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch task',
      });
    }
  }

  // PUT /tasks/:id - Update task
  static async updateTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { title, description, status } = req.body as UpdateTaskData;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid task ID',
        });
      }

      // Check if task exists
      const taskExists = await TaskService.taskExists(id);
      if (!taskExists) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      // Validate status if provided
      if (status && !TaskService.isValidStatus(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Valid statuses are: ${TaskService.getValidStatuses().join(', ')}`,
        });
      }

      // Validate title if provided
      if (title !== undefined && (!title || title.trim().length === 0)) {
        return res.status(400).json({
          success: false,
          error: 'Task title cannot be empty',
        });
      }

      const updateData: UpdateTaskData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (status !== undefined) updateData.status = status;

      const task = await TaskService.updateTask(id, updateData);

      res.json({
        success: true,
        data: task,
        message: 'Task updated successfully',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update task',
      });
    }
  }

  // DELETE /tasks/:id - Delete task
  static async deleteTask(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid task ID',
        });
      }

      // Check if task exists
      const taskExists = await TaskService.taskExists(id);
      if (!taskExists) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      await TaskService.deleteTask(id);

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete task',
      });
    }
  }
}