import { NotFoundError } from 'restify-errors';
import { StatusCodes } from 'http-status-codes';

import { IUsersRepository } from '../../repository/IUsersRepository';

import { IAuthService, IEncryptService } from '../../../../@types/interfaces';
import { ISuccess } from '../../../../@types/interfaces';
import { TokenPayload, TokenReturn } from '../../../../@types/types';

interface IRequest {
  email: string;
  password: string;
}

class LoginUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService<TokenPayload>,
    private encryptService: IEncryptService
  ) {}

  async execute({
    email,
    password,
  }: IRequest): Promise<ISuccess<TokenReturn> | never> {
    const user = await this.userRepository.findByEmail({ email });

    if (!user) {
      throw new NotFoundError('Invalid email or password');
    }

    const isPasswordValid = await this.encryptService.verify(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new NotFoundError('Invalid email or password');
    }

    const token = this.authService.createToken(user.id);

    return {
      statusCode: StatusCodes.OK,
      data: { token },
    };
  }
}

export { LoginUserUseCase };
