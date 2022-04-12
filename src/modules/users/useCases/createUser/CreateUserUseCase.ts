import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { ISuccess } from '../../../../helpers/interfaces';
import { IUsersRepository } from '../../repository/IUsersRepository';

interface IRequest {
  email: string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ email, username, password }: IRequest): Promise<ISuccess<User>> {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      username,
      password: encryptedPassword,
    });

    return {
      statusCode: 'CREATED',
      data: newUser,
    }
  }
}

export { CreateUserUseCase };
