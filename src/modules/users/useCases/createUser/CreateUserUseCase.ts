import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { IError, ISuccess } from '../../../../helpers/interfaces';
import { IUsersRepository } from '../../repository/IUsersRepository';

interface IRequest {
  email: string;
  username: string;
  password: string;
}

type IResponse = IError | ISuccess<User>;

class CreateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ email, username, password }: IRequest): Promise<IResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      return {
        statusCode: 'CONFLICT',
        message: 'User already exists',
      };
    }

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
