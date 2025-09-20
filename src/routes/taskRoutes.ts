import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();

// Task routes for specific tasks
// GET /tasks/:id - Get task by ID
router.get('/:id', TaskController.getTaskById);

// PUT /tasks/:id - Update task
router.put('/:id', TaskController.updateTask);

// DELETE /tasks/:id - Delete task
router.delete('/:id', TaskController.deleteTask);

export default router;