import { User as IUser } from '@prisma/client';

import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess } from '../../../../@types/interfaces';

import { ConflictError, InternalError } from '../../../../utils/Errors';

class UniqueUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(email: string): Promise<ISuccess<null> | void> {
    let user: IUser | null = null;

    try {
      user = await this.userRepository.findByEmail(email);
    } catch (err) {
      throw new InternalError(
        'Unexpected error while checking user uniqueness',
        err
      );
    }

    if (user) {
      throw new ConflictError('User already exists');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueUserUseCase };
