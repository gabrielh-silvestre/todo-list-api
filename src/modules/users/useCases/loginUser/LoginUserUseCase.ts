import { IUsersRepository } from '../../repository/IUsersRepository';

import { IAuth, TokenPayload } from '../../../../services/Auth';
import { IError, ISuccess } from '../../../../@types/statusCodes';
import { IEncript } from '../../../../services/Encript';

interface IRequest {
  email: string;
  password: string;
}

class LoginUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuth<TokenPayload>,
    private encriptService: IEncript
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

    const isPasswordValid = await this.encriptService.verify(
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
