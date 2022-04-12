import { User } from '@prisma/client';

import { IAuthService, ISuccess } from '../../../../@types/interfaces';
import { IEncriptService } from '../../../../@types/interfaces';
import { TokenPayload } from '../../../../@types/types';
import { IUsersRepository } from '../../repository/IUsersRepository';

interface IRequest {
  email: string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService<TokenPayload>,
    private encriptService: IEncriptService
  ) {}

  async execute({
    email,
    username,
    password,
  }: IRequest): Promise<ISuccess<User['id']>> {
    const encryptedPassword = await this.encriptService.encript(password);

    const newUserId = await this.userRepository.create({
      email,
      username,
      password: encryptedPassword,
    });

    const token = this.authService.createToken(newUserId);

    return {
      statusCode: 'CREATED',
      data: token,
    };
  }
}

export { CreateUserUseCase };
