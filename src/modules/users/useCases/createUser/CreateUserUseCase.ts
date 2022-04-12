import { User } from '@prisma/client';

import { ISuccess } from '../../../../@types/statusCodes';
import { IAuth, TokenPayload } from '../../../../midleware/auth';
import { IUsersRepository } from '../../repository/IUsersRepository';

interface IRequest {
  email: string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuth<TokenPayload>
  ) {}

  async execute({
    email,
    username,
    password,
  }: IRequest): Promise<ISuccess<User>> {
    const encryptedPassword = await this.authService.encriptPassword(password);

    const newUser = await this.userRepository.create({
      email,
      username,
      password: encryptedPassword,
    });

    return {
      statusCode: 'CREATED',
      data: newUser,
    };
  }
}

export { CreateUserUseCase };
