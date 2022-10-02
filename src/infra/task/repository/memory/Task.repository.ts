import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";

import { Task } from "@domain/task/entity/Task";

export class TasksRepositoryInMemory implements ITaskRepository {
  private static readonly TASKS: Task[] = [];

  async findAll(userId: string): Promise<Task[]> {
    const foundTasks = TasksRepositoryInMemory.TASKS.filter(
      (task) => task.userId === userId
    );

    return foundTasks.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.description,
          task.status,
          task.userId,
          task.updatedAt
        )
    );
  }

  async find(userId: string, id: string): Promise<Task | null> {
    const foundTask = TasksRepositoryInMemory.TASKS.find(
      (task) => task.id === id && task.userId === userId
    );

    return foundTask
      ? new Task(
          foundTask.id,
          foundTask.title,
          foundTask.description,
          foundTask.status,
          foundTask.userId,
          foundTask.updatedAt
        )
      : null;
  }

  async findByTitle(userId: string, title: string): Promise<Task | null> {
    const foundTask = TasksRepositoryInMemory.TASKS.find(
      (task) => task.title === title && task.userId === userId
    );

    return foundTask
      ? new Task(
          foundTask.id,
          foundTask.title,
          foundTask.description,
          foundTask.status,
          foundTask.userId,
          foundTask.updatedAt
        )
      : null;
  }

  async delete(userId: string, id: string): Promise<void> {
    const foundTaskIndex = TasksRepositoryInMemory.TASKS.findIndex(
      (task) => task.id === id && task.userId === userId
    );

    TasksRepositoryInMemory.TASKS.splice(foundTaskIndex, 1);
  }

  async create(entity: Task): Promise<void> {
    TasksRepositoryInMemory.TASKS.push(entity);
  }

  async update(entity: Task): Promise<void> {
    const foundTaskIndex = TasksRepositoryInMemory.TASKS.findIndex(
      (task) => task.id === entity.id && task.userId === entity.userId
    );

    TasksRepositoryInMemory.TASKS[foundTaskIndex] = entity;
  }

  static dump(): void {
    TasksRepositoryInMemory.TASKS.length = 0;
  }

  static populate(tasks: Task[]): void {
    TasksRepositoryInMemory.TASKS.push(...tasks);
  }
}
