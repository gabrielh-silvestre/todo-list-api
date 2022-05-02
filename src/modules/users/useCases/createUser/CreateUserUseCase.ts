import { IUsersRepository } from '../../repository/IUsersRepository';
import { IAuthService, ISuccess } from '../../../../@types/interfaces';
import { IEncryptService } from '../../../../@types/interfaces';
import { TokenPayload } from '../../../../@types/types';

import { ConflictError } from '../../../../utils/Errors';

interface IRequest {
  email: string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private authService: IAuthService<TokenPayload>,
    private encryptService: IEncryptService
  ) {}

  async isUnique(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new ConflictError('User already exists');
    }
  }

  async execute({
    email,
    username,
    password,
  }: IRequest): Promise<ISuccess<string> | void> {
    await this.isUnique(email);

    const encryptedPassword = await this.encryptService.encrypt(password);

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
