import type { ITasksRepository } from '../../../@types/interfaces';
import type {
  TaskCreateAttributes,
  TaskIdentifierById,
  TaskIdentifierByTitle,
  TaskIdentifierByUser,
  TaskReturn,
  TaskUpdateAttributes,
} from '../../../@types/types';

import { prisma } from '../../prisma';

class TasksRepository implements ITasksRepository {
  async create({
    title,
    description,
    userId,
  }: TaskCreateAttributes): Promise<TaskReturn> {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
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

  async update(taskData: TaskUpdateAttributes): Promise<TaskReturn> {
    const { id, userId, title, description, status } = taskData;

    const updatedTask = await prisma.task.update({
      where: { id_userId: { id, userId } },
      data: { title, description, status },
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

  async findAll({ userId }: TaskIdentifierByUser): Promise<TaskReturn[]> {
    const foundTasks = await prisma.task.findMany({
      where: { userId },
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
  }: TaskIdentifierById): Promise<TaskReturn | null> {
    const foundTask = await prisma.task.findUnique({
      where: { id_userId: { id, userId } },
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
  }: TaskIdentifierByTitle): Promise<TaskReturn[]> {
    const foundTask = await prisma.task.findMany({
      where: { title, userId },
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

  async delete({ id, userId }: TaskIdentifierById): Promise<void> {
    await prisma.task.delete({
      where: { id_userId: { id, userId } },
    });
  }
}

export { TasksRepository };
