import { IUsersRepository } from '../../repository/IUsersRepository';

import { IAuth, TokenPayload } from '../../../../midleware/auth';
import { IError, ISuccess } from '../../../../@types/statusCodes';

interface IRequest {
  email: string;
  password: string;
}

class LoginUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuth<TokenPayload>
  ) {}

  async execute({
    email,
    password,
  }: IRequest): Promise<ISuccess<string> | IError> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        statusCode: 'NOT_FOUND',
        message: 'Invalid email or password',
      };
    }

    const isPasswordValid = await this.authService.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        statusCode: 'NOT_FOUND',
        message: 'Invalid email or password',
      };
    }

    return {
      statusCode: 'OK',
      data: this.authService.createToken(user.id),
    };
  }
}

export { LoginUserUseCase };
