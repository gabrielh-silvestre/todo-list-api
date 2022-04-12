import { User } from '@prisma/client';

interface IUsersRepositoryDTO {
  email: string;
  username: string;
  password: string;
}

interface IUsersRepository {
  create({
    email,
    username,
    password,
  }: IUsersRepositoryDTO): Promise<User['id']>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export { IUsersRepository, IUsersRepositoryDTO };
