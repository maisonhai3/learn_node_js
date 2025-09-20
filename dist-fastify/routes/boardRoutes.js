"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardRoutes = boardRoutes;
const boardService_1 = require("../services/boardService");
const boardService = new boardService_1.BoardService();
async function boardRoutes(fastify) {
    // GET /boards - Get all boards
    fastify.get('/', async (request, reply) => {
        try {
            const result = await boardService.getAllBoards();
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
    // GET /boards/:id - Get board by ID
    fastify.get('/:id', async (request, reply) => {
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid board ID'
                });
            }
            const result = await boardService.getBoardById(id);
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
    // POST /boards - Create new board
    fastify.post('/', async (request, reply) => {
        try {
            const { name } = request.body;
            if (!name || name.trim() === '') {
                return reply.code(400).send({
                    success: false,
                    error: 'Board name is required'
                });
            }
            const result = await boardService.createBoard(name.trim());
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
    // PUT /boards/:id - Update board
    fastify.put('/:id', async (request, reply) => {
        try {
            const id = parseInt(request.params.id);
            const { name } = request.body;
            if (isNaN(id)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid board ID'
                });
            }
            if (!name || name.trim() === '') {
                return reply.code(400).send({
                    success: false,
                    error: 'Board name is required'
                });
            }
            const result = await boardService.updateBoard(id, name.trim());
            return reply.code(200).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            const err = error;
            if (err.code === 'P2025') {
                return reply.code(404).send({
                    success: false,
                    error: 'Board not found'
                });
            }
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // DELETE /boards/:id - Delete board
    fastify.delete('/:id', async (request, reply) => {
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.code(400).send({
                    success: false,
                    error: 'Invalid board ID'
                });
            }
            const result = await boardService.deleteBoard(id);
            return reply.code(200).send(result);
        }
        catch (error) {
            fastify.log.error(error);
            const err = error;
            if (err.code === 'P2025') {
                return reply.code(404).send({
                    success: false,
                    error: 'Board not found'
                });
            }
            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}
