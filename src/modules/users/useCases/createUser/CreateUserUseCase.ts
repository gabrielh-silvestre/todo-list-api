import { StatusCodes } from 'http-status-codes';

import type {
  IUsersRepository,
  IAuthService,
} from '@projectTypes/interfaces';
import type {
  TokenReturn,
  CreateUserUseCaseDTO,
  SuccessCase,
} from '@projectTypes/types';

class CreateUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService
  ) {}

  private async createLocalUser(
    id: string,
    username: string,
    email: string
  ): Promise<void | never> {
    const localUser = await this.userRepository.findByEmail(email);

    if (!localUser) {
      await this.userRepository.create({ id, username, email });
    }
  }

  async execute({
    email,
    username,
    password,
  }: CreateUserUseCaseDTO): Promise<SuccessCase<TokenReturn> | never> {
    const { token, user } = await this.authService.signUp({
      username,
      email,
      password,
    });

    await this.createLocalUser(user!.id, username, email);

    return {
      statusCode: StatusCodes.CREATED,
      data: { token },
    };
  }
}

export { CreateUserUseCase };
