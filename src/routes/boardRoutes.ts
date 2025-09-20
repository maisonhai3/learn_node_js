import { Router } from 'express';
import { BoardController } from '../controllers/boardController';
import { TaskController } from '../controllers/taskController';

const router = Router();

// GET /boards - Get all boards
router.get('/', BoardController.getAllBoards);

// GET /boards/:id - Get board by ID
router.get('/:id', BoardController.getBoardById);

// POST /boards - Create new board
router.post('/', BoardController.createBoard);

// PUT /boards/:id - Update board
router.put('/:id', BoardController.updateBoard);

// DELETE /boards/:id - Delete board
router.delete('/:id', BoardController.deleteBoard);

// Task routes within boards
// GET /boards/:boardId/tasks - Get all tasks for a board
router.get('/:boardId/tasks', TaskController.getTasksByBoard);

// POST /boards/:boardId/tasks - Create new task in a board
router.post('/:boardId/tasks', TaskController.createTask);

export default router;