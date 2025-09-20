import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTaskData {
  title: string;
  description?: string;
  status: string;
  boardId: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
}

export class TaskService {
  // Get all tasks for a specific board
  static async getTasksByBoardId(boardId: number) {
    return await prisma.task.findMany({
      where: { boardId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get task by ID
  static async getTaskById(id: number) {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        board: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Create new task
  static async createTask(data: CreateTaskData) {
    return await prisma.task.create({
      data,
      include: {
        board: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Update task
  static async updateTask(id: number, data: UpdateTaskData) {
    return await prisma.task.update({
      where: { id },
      data,
      include: {
        board: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Delete task
  static async deleteTask(id: number) {
    return await prisma.task.delete({
      where: { id },
    });
  }

  // Check if task exists
  static async taskExists(id: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!task;
  }

  // Get valid task statuses
  static getValidStatuses() {
    return ['Todo', 'In Progress', 'Done'];
  }

  // Check if status is valid
  static isValidStatus(status: string) {
    return this.getValidStatuses().includes(status);
  }
}