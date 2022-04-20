import { ErrorStatusCode } from '../../@types/types';

import { BaseError } from './BaseError';

class NotFoundError extends BaseError {
  constructor(message: string) {
    super(ErrorStatusCode.NOT_FOUND, message);
  }
}

export { NotFoundError };
