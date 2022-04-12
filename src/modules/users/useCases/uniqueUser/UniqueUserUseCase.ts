import { IError, ISuccess } from '../../../../@types/interfaces';
import { IUsersRepository } from '../../repository/IUsersRepository';

class UniqueUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(email: string): Promise<ISuccess<null> | IError> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      return {
        statusCode: 'CONFLICT',
        message: 'User already exists',
      };
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueUserUseCase };
