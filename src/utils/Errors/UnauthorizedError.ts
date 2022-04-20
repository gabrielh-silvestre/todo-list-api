import { ErrorStatusCode } from '../../@types/types';

import { BaseError } from './BaseError';

class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(ErrorStatusCode.UNAUTHORIZED, message);
  }
}

export { UnauthorizedError };
