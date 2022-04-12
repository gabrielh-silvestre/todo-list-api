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
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return newTask;
  }

  async findById(userId: string, id: string): Promise<TaskReturn | null> {
    const findedTask = await this.prisma.task.findUnique({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });

    return findedTask;
  }

  async findByTitle(
    userId: string,
    title: string
  ): Promise<TaskReturn[] | null> {
    const findedTask = await this.prisma.task.findMany({
      where: {
        title: {
          contains: title,
        },
        userId,
      },
    });

    return findedTask;
  }
}

export { TasksRepository };
