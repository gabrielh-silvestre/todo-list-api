import { IUsersRepository } from '../../repository/IUsersRepository';

import { IAuthService, IEncryptService } from '../../../../@types/interfaces';
import { ISuccess } from '../../../../@types/interfaces';
import { TokenPayload } from '../../../../@types/types';

import { NotFoundError } from '../../../../utils/Errors';

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
  }: IRequest): Promise<ISuccess<string> | void> {
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

    return {
      statusCode: 'OK',
      data: this.authService.createToken(user.id),
    };
  }
}

export { LoginUserUseCase };
