import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBoardData {
  name: string;
}

export interface UpdateBoardData {
  name?: string;
}

export class BoardService {
  // Get all boards
  static async getAllBoards() {
    return await prisma.board.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get board by ID
  static async getBoardById(id: number) {
    return await prisma.board.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  // Create new board
  static async createBoard(data: CreateBoardData) {
    return await prisma.board.create({
      data,
      include: {
        tasks: true,
      },
    });
  }

  // Update board
  static async updateBoard(id: number, data: UpdateBoardData) {
    return await prisma.board.update({
      where: { id },
      data,
      include: {
        tasks: true,
      },
    });
  }

  // Delete board
  static async deleteBoard(id: number) {
    // First delete all tasks in the board, then delete the board
    await prisma.task.deleteMany({
      where: { boardId: id },
    });
    
    return await prisma.board.delete({
      where: { id },
    });
  }

  // Check if board exists
  static async boardExists(id: number) {
    const board = await prisma.board.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!board;
  }
}