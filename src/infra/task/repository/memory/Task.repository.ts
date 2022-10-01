import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";

import { Task } from "@domain/task/entity/Task";

export class TasksRepositoryInMemory implements ITaskRepository {
  private readonly TASKS: Task[] = [];

  async findAll(userId: string): Promise<Task[]> {
    const foundTasks = this.TASKS.filter((task) => task.userId === userId);

    return foundTasks;
  }

  async find(userId: string, id: string): Promise<Task | null> {
    const foundTask = this.TASKS.find(
      (task) => task.id === id && task.userId === userId
    );

    return foundTask || null;
  }

  async findByTitle(userId: string, title: string): Promise<Task | null> {
    const foundTask = this.TASKS.find(
      (task) => task.title === title && task.userId === userId
    );

    return foundTask || null;
  }

  async delete(userId: string, id: string): Promise<void> {
    const foundTaskIndex = this.TASKS.findIndex(
      (task) => task.id === id && task.userId === userId
    );

    this.TASKS.splice(foundTaskIndex, 1);
  }

  async create(entity: Task): Promise<void> {
    this.TASKS.push(entity);
  }

  async update(entity: Task): Promise<void> {
    const foundTaskIndex = this.TASKS.findIndex(
      (task) => task.id === entity.id && task.userId === entity.userId
    );

    this.TASKS[foundTaskIndex] = entity;
  }
}
