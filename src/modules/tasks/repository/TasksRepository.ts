import {
  ITasksRepository,
  ITaskIdentifierByUser,
  ITasksRepositoryDTO,
  ITasksRepositoryFindByEmailDTO,
  ITasksRepositoryUpdateDTO,
  ITaskUserIdentifier,
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

  async update({
    userId,
    id,
    taskData,
  }: ITasksRepositoryUpdateDTO): Promise<TaskReturn> {
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

  async findAll({ userId }: ITaskUserIdentifier): Promise<TaskReturn[]> {
    const foundTasks = await prisma.task.findMany({
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

    return foundTasks;
  }

  async findById({
    id,
    userId,
  }: ITaskIdentifierByUser): Promise<TaskReturn | null> {
    const foundTask = await prisma.task.findUnique({
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

    return foundTask;
  }

  async findByExactTitle({
    title,
    userId,
  }: ITasksRepositoryFindByEmailDTO): Promise<TaskReturn[]> {
    const foundTask = await prisma.task.findMany({
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

    return foundTask;
  }

  async delete({ id, userId }: ITaskIdentifierByUser): Promise<void> {
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
