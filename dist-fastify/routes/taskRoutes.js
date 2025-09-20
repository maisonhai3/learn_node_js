"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = taskRoutes;
exports.boardTaskRoutes = boardTaskRoutes;
const taskService_1 = require("../services/taskService");
const taskService = new taskService_1.TaskService();
async function taskRoutes(fastify) {
    // GET /tasks/:id - Get task by ID
    fastify.get('/:id', async (request, reply) => {
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid task ID'
                });
            }
            const result = await taskService.getTaskById(id);
            if (!result.success) {
                return reply.code(404).send(result);
            }
            return reply.code(200).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // PUT /tasks/:id - Update task
    fastify.put('/:id', async (request, reply) => {
        try {
            const id = parseInt(request.params.id);
            const updateData = request.body;
            if (isNaN(id)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid task ID'
                });
            }
            // Validate status if provided
            if (updateData.status && !['Todo', 'In Progress', 'Done'].includes(updateData.status)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid status. Must be: Todo, In Progress, or Done'
                });
            }
            const result = await taskService.updateTask(id, updateData);
            return reply.code(200).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            const err = error;
            if (err.code === 'P2025') {
                return reply.code(404).send({
                    success: false,
                    error: 'Task not found'
                });
            }
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // DELETE /tasks/:id - Delete task
    fastify.delete('/:id', async (request, reply) => {
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid task ID'
                });
            }
            const result = await taskService.deleteTask(id);
            return reply.code(200).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            const err = error;
            if (err.code === 'P2025') {
                return reply.code(404).send({
                    success: false,
                    error: 'Task not found'
                });
            }
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}
async function boardTaskRoutes(fastify) {
    // GET /boards/:boardId/tasks - Get all tasks in a board
    fastify.get('/:boardId/tasks', async (request, reply) => {
        try {
            const boardId = parseInt(request.params.boardId);
            if (isNaN(boardId)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid board ID'
                });
            }
            // Check if board exists
            const boardExists = await taskService.checkBoardExists(boardId);
            if (!boardExists) {
                return reply.code(404).send({
                    success: false,
                    error: 'Board not found'
                });
            }
            const result = await taskService.getTasksByBoard(boardId);
            return reply.code(200).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // POST /boards/:boardId/tasks - Create new task in board
    fastify.post('/:boardId/tasks', async (request, reply) => {
        try {
            const boardId = parseInt(request.params.boardId);
            const { title, description, status = 'Todo' } = request.body;
            if (isNaN(boardId)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid board ID'
                });
            }
            if (!title || title.trim() === '') {
                return reply.code(400).send({
                    success: false,
                    error: 'Task title is required'
                });
            }
            // Validate status
            if (status && !['Todo', 'In Progress', 'Done'].includes(status)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid status. Must be: Todo, In Progress, or Done'
                });
            }
            // Check if board exists
            const boardExists = await taskService.checkBoardExists(boardId);
            if (!boardExists) {
                return reply.code(404).send({
                    success: false,
                    error: 'Board not found'
                });
            }
            const result = await taskService.createTask(boardId, title.trim(), description, status);
            return reply.code(201).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}
