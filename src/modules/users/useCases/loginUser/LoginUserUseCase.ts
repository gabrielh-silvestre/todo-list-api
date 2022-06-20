import { StatusCodes } from 'http-status-codes';

import { IUsersRepository } from '../../repository/IUsersRepository';

import { IAuthService } from '../../../../@types/interfaces';
import { ISuccess } from '../../../../@types/interfaces';
import { TokenReturn } from '../../../../@types/types';

interface IRequest {
  email: string;
  password: string;
}

class LoginUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService
  ) {}

  private async syncLocalUser(
    id: string,
    username: string,
    email: string
  ): Promise<void | never> {
    const localUser = await this.userRepository.findByEmail({ email });

    if (!localUser) {
      await this.userRepository.create({ id, username, email });
    }
  }

  async execute({
    email,
    password,
  }: IRequest): Promise<ISuccess<TokenReturn> | never> {
    const { token, user } = await this.authService.signIn({ email, password });

    await this.syncLocalUser(user!.id, user!.user_metadata.username, email);

    return {
      statusCode: StatusCodes.OK,
      data: { token },
    };
  }
}

export { LoginUserUseCase };
