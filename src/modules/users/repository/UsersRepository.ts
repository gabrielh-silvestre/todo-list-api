import { User } from '@prisma/client';

import {
  IBasicUserData,
  IUserIdentifier,
  IUserIdentifierByEmail,
  IUsersRepository,
} from './IUsersRepository';
import { prisma } from '../../prisma';

class UserRepository implements IUsersRepository {
  async create({ email, username, password }: IBasicUserData): Promise<string> {
    const { id } = await prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });

    return id;
  }

  async findByEmail({ email }: IUserIdentifierByEmail): Promise<User | null> {
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return foundUser;
  }

  async findById({ id }: IUserIdentifier): Promise<User | null> {
    const foundUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return foundUser;
  }
}

export { UserRepository };
