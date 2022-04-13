import { PrismaClient } from '@prisma/client';
import { TaskReturn } from '../../../@types/types';
import { ITasksRepository, ITasksRepositoryDTO } from './ITasksRepository';

class TasksRepository implements ITasksRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create({
    title,
    description,
    userId,
  }: ITasksRepositoryDTO): Promise<TaskReturn> {
    const newTask = await this.prisma.task.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return newTask as TaskReturn;
  }

  async findById(userId: string, id: string): Promise<TaskReturn | null> {
    const findedTask = await this.prisma.task.findUnique({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return findedTask;
  }

  async findByTitle(userId: string, title: string): Promise<TaskReturn[]> {
    const findedTask = await this.prisma.task.findMany({
      where: {
        title: {
          contains: title,
        },
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return findedTask as TaskReturn[];
  }
}

export { TasksRepository };
