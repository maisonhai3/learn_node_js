"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BoardService {
    async getAllBoards() {
        try {
            const boards = await prisma.board.findMany({
                include: {
                    tasks: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: boards, count: boards.length };
        }
        catch (error) {
            console.error('Error fetching boards:', error);
            throw error;
        }
    }
    async getBoardById(id) {
        try {
            const board = await prisma.board.findUnique({
                where: { id },
                include: {
                    tasks: true
                }
            });
            if (!board) {
                return { success: false, error: 'Board not found' };
            }
            return { success: true, data: board };
        }
        catch (error) {
            console.error('Error fetching board:', error);
            throw error;
        }
    }
    async createBoard(name) {
        try {
            const board = await prisma.board.create({
                data: { name },
                include: {
                    tasks: true
                }
            });
            return { success: true, data: board };
        }
        catch (error) {
            console.error('Error creating board:', error);
            throw error;
        }
    }
    async updateBoard(id, name) {
        try {
            const board = await prisma.board.update({
                where: { id },
                data: { name },
                include: {
                    tasks: true
                }
            });
            return { success: true, data: board };
        }
        catch (error) {
            console.error('Error updating board:', error);
            throw error;
        }
    }
    async deleteBoard(id) {
        try {
            await prisma.board.delete({
                where: { id }
            });
            return { success: true, message: 'Board deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting board:', error);
            throw error;
        }
    }
}
exports.BoardService = BoardService;
