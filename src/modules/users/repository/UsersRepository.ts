import type { IUsersRepository } from '../../../@types/interfaces';
import type {
  UserAttributes,
  UserCreateAttributes,
} from '../../../@types/types';

import { prisma } from '../../prisma';

class UserRepository implements IUsersRepository {
  async create({ id, email, username }: UserCreateAttributes): Promise<void> {
    await prisma.user.create({
      data: { id, email, username },
    });
  }

  async findByEmail(email: string): Promise<UserAttributes | null> {
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return foundUser;
  }

  async findById(id: string): Promise<UserAttributes | null> {
    const foundUser = await prisma.user.findUnique({
      where: { id },
    });

    return foundUser;
  }
}

export { UserRepository };
