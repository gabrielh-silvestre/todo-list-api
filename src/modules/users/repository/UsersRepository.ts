import { PrismaClient, User } from '@prisma/client';
import { IUsersRepository, IUsersRepositoryDTO } from './IUsersRepository';

class UserRepository implements IUsersRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create({
    email,
    username,
    password,
  }: IUsersRepositoryDTO): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const findedUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return findedUser;
  }

  async findById(id: string): Promise<User | null> {
    const findedUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return findedUser;
  }
}

export { UserRepository };
