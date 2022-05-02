import { IUsersRepository } from '../../repository/IUsersRepository';
import { ISuccess } from '../../../../@types/interfaces';

import { NotFoundError } from '../../../../utils/Errors';

interface IRequest {
  id: string;
}

class VerifyUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({ id }: IRequest): Promise<ISuccess<null>> {
    const foundUser = await this.userRepository.findById({ id });

    if (!foundUser) {
      throw new NotFoundError('User does not exist');
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyUserUseCase };
