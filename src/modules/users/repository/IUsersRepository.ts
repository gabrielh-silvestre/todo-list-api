import { User } from '../model/User';

interface IUsersRepositoryDTO {
  email: string;
  username: string;
  password: string;
}

interface IUsersRepository {
  create({ email, username, password }: IUsersRepositoryDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export { IUsersRepository, IUsersRepositoryDTO };
