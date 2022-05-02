import { User } from '@prisma/client';

interface IBasicUserData {
  email: string;
  username: string;
  password: string;
}

interface IUserIdentifier {
  id: string;
}

interface IUserIdentifierByEmail {
  email: string;
}

interface IUsersRepository {
  create({ email, username, password }: IBasicUserData): Promise<string>;
  findById(id: IUserIdentifier): Promise<User | null>;
  findByEmail(email: IUserIdentifierByEmail): Promise<User | null>;
}

export {
  IUsersRepository,
  IBasicUserData,
  IUserIdentifier,
  IUserIdentifierByEmail,
};
