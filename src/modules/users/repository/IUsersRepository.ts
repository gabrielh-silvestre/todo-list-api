import { UserAttributes, UserCreateAttributes } from '../../../@types/types';

interface IUsersRepository {
  create(newUserCredentials: UserCreateAttributes): Promise<void>;
  findById(id: string): Promise<UserAttributes | null>;
  findByEmail(email: string): Promise<UserAttributes | null>;
}

export { IUsersRepository };
