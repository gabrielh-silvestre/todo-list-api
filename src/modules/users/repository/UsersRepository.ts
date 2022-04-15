import { User } from '@prisma/client';

import { IUsersRepository, IUsersRepositoryDTO } from './IUsersRepository';
import { prisma } from '../../prisma';

class UserRepository implements IUsersRepository {
  async create({
    email,
    username,
    password,
  }: IUsersRepositoryDTO): Promise<User['id']> {
    const { id } = await prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });

    return id;
  }

  async findByEmail(email: string): Promise<User | null> {
    const findedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return findedUser;
  }

  async findById(id: string): Promise<User | null> {
    const findedUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return findedUser;
  }
}

export { UserRepository };
