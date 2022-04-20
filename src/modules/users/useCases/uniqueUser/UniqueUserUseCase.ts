import { User as IUser } from '@prisma/client';

import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

class UniqueUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(email: string): Promise<ISuccess<null> | void> {
    let user: IUser | null = null;

    try {
      user = await this.userRepository.findByEmail(email);
    } catch (error) {
      throw new CustomError(
        ErrorStatusCode.BAD_REQUEST,
        'Unexpected error while checking user uniqueness'
      );
    }

    if (user) {
      throw new CustomError(
        ErrorStatusCode.INTERNAL_SERVER_ERROR,
        'User already exists'
      );
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueUserUseCase };
