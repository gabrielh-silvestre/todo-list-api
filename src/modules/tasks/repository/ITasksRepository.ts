import { Task, TaskStatus } from '@prisma/client';

interface ITasksRepositoryDTO {
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
}

interface ITasksRepository {
  create({
    title,
    description,
    status,
    userId,
  }: ITasksRepositoryDTO): Promise<Task>;
  findById(userId: string, id: string): Promise<Task | null>;
  findByTitle(userId: string, title: string): Promise<Task[] | null>;
}

export { ITasksRepository, ITasksRepositoryDTO };
