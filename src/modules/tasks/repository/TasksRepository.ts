import {
  ITasksRepository,
  ITasksRepositoryDTO,
  ITasksRepositoryUpdateDTO,
} from './ITasksRepository';
import { TaskReturn } from '../../../@types/types';

import { prisma } from '../../prisma';

class TasksRepository implements ITasksRepository {
  async create({
    title,
    description,
    userId,
  }: ITasksRepositoryDTO): Promise<TaskReturn> {
    const newTask = await prisma.task.create({
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

  async update(
    userId: string,
    id: string,
    taskData: ITasksRepositoryUpdateDTO
  ): Promise<TaskReturn> {
    const updatedTask = await prisma.task.update({
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

  async findAll(userId: string): Promise<TaskReturn[]> {
    const findedTasks = await prisma.task.findMany({
      where: {
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

    return findedTasks;
  }

  async findById(userId: string, id: string): Promise<TaskReturn | null> {
    const findedTask = await prisma.task.findUnique({
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

  async findByExactTitle(userId: string, title: string): Promise<TaskReturn[]> {
    const findedTask = await prisma.task.findMany({
      where: {
        title,
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
    await prisma.task.delete({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });
  }
}

export { TasksRepository };
