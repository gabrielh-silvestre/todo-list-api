import { User } from '@prisma/client';

import { IUsersRepository } from './IUsersRepository';
import {
  IBasicUserData,
  IUserIdentifier,
  IUserIdentifierByEmail,
} from '../../../@types/interfaces';

import { prisma } from '../../prisma';

class UserRepository implements IUsersRepository {
  async create({ id, email, username }: IBasicUserData): Promise<void> {
    await prisma.user.create({
      data: { id, email, username },
    });
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
      where: { id },
    });

    return foundUser;
  }
}

export { UserRepository };
