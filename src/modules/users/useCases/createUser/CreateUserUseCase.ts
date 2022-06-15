import { ConflictError } from 'restify-errors';
import { StatusCodes } from 'http-status-codes';

import { IUsersRepository } from '../../repository/IUsersRepository';
import {
  IAuthService,
  IBasicUserData,
  ISuccess,
  IEncryptService,
} from '../../../../@types/interfaces';
import { TokenPayload, TokenReturn } from '../../../../@types/types';

interface IRequest extends IBasicUserData {}

class CreateUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService<TokenPayload>,
    private encryptService: IEncryptService
  ) {}

  async isUnique(email: string): Promise<void | never> {
    const user = await this.userRepository.findByEmail({ email });

    if (user) {
      throw new ConflictError('User already exists');
    }
  }

  async execute({
    email,
    username,
    password,
  }: IRequest): Promise<ISuccess<TokenReturn> | never> {
    await this.isUnique(email);

    const encryptedPassword = await this.encryptService.encrypt(password);

    const newUserId = await this.userRepository.create({
      email,
      username,
      password: encryptedPassword,
    });

    const token = this.authService.createToken(newUserId);

    return {
      statusCode: StatusCodes.CREATED,
      data: { token },
    };
  }
}

export { CreateUserUseCase };
