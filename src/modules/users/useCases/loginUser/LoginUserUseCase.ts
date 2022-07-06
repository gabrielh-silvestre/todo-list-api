import { StatusCodes } from "http-status-codes";

import type { IUsersRepository, IAuthService } from "@projectTypes/interfaces";
import type {
  LoginUserUseCaseDTO,
  SuccessCase,
  TokenReturn,
} from "@projectTypes/types";

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
    const localUser = await this.userRepository.findByEmail(email);

    if (!localUser) {
      await this.userRepository.create({ id, username, email });
    }
  }

  async execute({
    email,
    password,
  }: LoginUserUseCaseDTO): Promise<SuccessCase<TokenReturn> | never> {
    const { token, user } = await this.authService.signIn({ email, password });

    await this.syncLocalUser(user!.id, user!.user_metadata.username, email);

    return {
      statusCode: StatusCodes.OK,
      data: { token },
    };
  }
}

export { LoginUserUseCase };
