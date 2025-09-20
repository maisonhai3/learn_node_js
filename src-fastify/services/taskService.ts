import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskService {
  async getTasksByBoard(boardId: number) {
    try {
      const tasks = await prisma.task.findMany({
        where: { boardId },
        include: {
          board: {
            select: { id: true, name: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return { success: true, data: tasks, count: tasks.length };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: number) {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          board: {
            select: { id: true, name: true }
          }
        }
      });
      
      if (!task) {
        return { success: false, error: 'Task not found' };
      }
      
      return { success: true, data: task };
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(boardId: number, title: string, description?: string, status: string = 'Todo') {
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          boardId
        },
        include: {
          board: {
            select: { id: true, name: true }
          }
        }
      });
      return { success: true, data: task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: number, updateData: { title?: string; description?: string; status?: string }) {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          board: {
            select: { id: true, name: true }
          }
        }
      });
      return { success: true, data: task };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: number) {
    try {
      await prisma.task.delete({
        where: { id }
      });
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async checkBoardExists(boardId: number) {
    try {
      const board = await prisma.board.findUnique({
        where: { id: boardId }
      });
      return !!board;
    } catch (error) {
      console.error('Error checking board existence:', error);
      return false;
    }
  }
}