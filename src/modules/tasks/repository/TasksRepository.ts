import { PrismaClient } from '@prisma/client';

import {
  ITasksRepository,
  ITasksRepositoryDTO,
  ITasksRepositoryUpdateDTO,
} from './ITasksRepository';
import { TaskReturn } from '../../../@types/types';

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

    return findedTask;
  }

  async delete(userId: string, id: string) {
    await this.prisma.task.delete({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });
  }

  async update(
    userId: string,
    id: string,
    taskData: ITasksRepositoryUpdateDTO
  ): Promise<TaskReturn> {
    const updatedTask = await this.prisma.task.update({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data: {
        ...taskData,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return updatedTask;
  }
}

export { TasksRepository };
