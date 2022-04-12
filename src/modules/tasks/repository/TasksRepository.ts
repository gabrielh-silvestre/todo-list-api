import { PrismaClient, Task } from '@prisma/client';
import { ITasksRepository, ITasksRepositoryDTO } from './ITasksRepository';

class TasksRepository implements ITasksRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create({
    title,
    description,
    status,
    userId,
  }: ITasksRepositoryDTO): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: {
        title,
        description,
        status,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return newTask;
  }

  async findById(userId: string, id: string): Promise<Task | null> {
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

  async findByTitle(userId: string, title: string): Promise<Task[] | null> {
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
