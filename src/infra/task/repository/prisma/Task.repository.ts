import { PrismaClient } from "@prisma/client";

import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";

import { Task } from "@domain/task/entity/Task";

export class TasksRepository implements ITaskRepository {
  private readonly prisma = new PrismaClient();

  async findAll(userId: string): Promise<Task[]> {
    const foundTasks = await this.prisma.task.findMany({ where: { userId } });

    return foundTasks.map((task) => {
      return new Task(
        task.id,
        task.title,
        task.description,
        task.status,
        task.userId,
        task.updatedAt
      );
    });
  }

  async find(userId: string, id: string): Promise<Task | null> {
    const foundTask = await this.prisma.task.findUnique({
      where: { id_userId: { id, userId } },
    });

    if (!foundTask) {
      return null;
    }

    return new Task(
      foundTask.id,
      foundTask.title,
      foundTask.description,
      foundTask.status,
      foundTask.userId,
      foundTask.updatedAt
    );
  }

  async findByTitle(userId: string, title: string): Promise<Task | null> {
    const foundTask = await this.prisma.task.findUnique({
      where: { title_userId: { title, userId } },
    });

    if (!foundTask) {
      return null;
    }

    return new Task(
      foundTask.id,
      foundTask.title,
      foundTask.description,
      foundTask.status,
      foundTask.userId,
      foundTask.updatedAt
    );
  }

  async create(entity: Task): Promise<void> {
    await this.prisma.task.create({
      data: {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        status: entity.status,
        userId: entity.userId,
        updatedAt: entity.updatedAt,
      },
    });
  }

  async update(entity: Task): Promise<void> {
    await this.prisma.task.update({
      where: { id_userId: { id: entity.id, userId: entity.userId } },
      data: {
        title: entity.title,
        description: entity.description,
        status: entity.status,
        updatedAt: entity.updatedAt,
      },
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id_userId: { id, userId } },
    });
  }
}
