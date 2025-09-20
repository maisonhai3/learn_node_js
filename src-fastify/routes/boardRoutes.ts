import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BoardService } from '../services/boardService';

const boardService = new BoardService();

// Type definitions for request parameters
interface BoardParams {
  id: string;
}

interface CreateBoardBody {
  name: string;
}

interface UpdateBoardBody {
  name: string;
}

export async function boardRoutes(fastify: FastifyInstance) {
  // GET /boards - Get all boards
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await boardService.getAllBoards();
      return reply.code(200).send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // GET /boards/:id - Get board by ID
  fastify.get<{ Params: BoardParams }>('/:id', async (request, reply) => {
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
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // POST /boards - Create new board
  fastify.post<{ Body: CreateBoardBody }>('/', async (request, reply) => {
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
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // PUT /boards/:id - Update board
  fastify.put<{ Params: BoardParams; Body: UpdateBoardBody }>('/:id', async (request, reply) => {
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
    } catch (error) {
      fastify.log.error(error);
      const err = error as any;
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
  fastify.delete<{ Params: BoardParams }>('/:id', async (request, reply) => {
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
    } catch (error) {
      fastify.log.error(error);
      const err = error as any;
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