import { User as IUser } from '@prisma/client';
import { ISuccess } from '../../../../@types/interfaces';
import { IUsersRepository } from '../../repository/IUsersRepository';

import { CustomError } from '../../../../utils/CustomError';

class UniqueUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(email: string): Promise<ISuccess<null> | void> {
    let user: IUser | null = null;

    try {
      user = await this.userRepository.findByEmail(email);
    } catch (error) {
      throw new CustomError(
        'INTERNAL_SERVER_ERROR',
        'Unexpected error while checking user uniqueness'
      );
    }

    if (user) {
      throw new CustomError('CONFLICT', 'User already exists');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueUserUseCase };
