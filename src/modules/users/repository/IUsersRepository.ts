import { User } from '@prisma/client';
import {
  IBasicUserData,
  IUserIdentifier,
  IUserIdentifierByEmail,
} from '../../../@types/interfaces';

interface IUsersRepository {
  create({ email, username, password }: IBasicUserData): Promise<string>;
  findById(id: IUserIdentifier): Promise<User | null>;
  findByEmail(email: IUserIdentifierByEmail): Promise<User | null>;
}

export { IUsersRepository };
