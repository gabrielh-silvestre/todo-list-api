import { User } from '@prisma/client';
import { IUsersRepository } from '../../repository/IUsersRepository';

import { IAuthService, IEncriptService } from '../../../../@types/interfaces';
import { IError, ISuccess } from '../../../../@types/interfaces';
import { TokenPayload } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

interface IRequest {
  email: string;
  password: string;
}

class LoginUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService<TokenPayload>,
    private encriptService: IEncriptService
  ) {}

  async execute({
    email,
    password,
  }: IRequest): Promise<ISuccess<string> | void> {
    let user: User | null = null;

    try {
      user = await this.userRepository.findByEmail(email);
    } catch (err) {
      throw new CustomError(
        'INTERNAL_SERVER_ERROR',
        'Unexpected error while login user'
      );
    }

    if (!user) {
      throw new CustomError('NOT_FOUND', 'Invalid email or password');
    }

    const isPasswordValid = await this.encriptService.verify(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new CustomError('NOT_FOUND', 'Invalid email or password');
    }

    return {
      statusCode: 'OK',
      data: this.authService.createToken(user.id),
    };
  }
}

export { LoginUserUseCase };
