import { ErrorStatusCode } from '../../@types/types';

import { BaseError } from './BaseError';

class BadRequestError extends BaseError {
  constructor(message: string) {
    super(ErrorStatusCode.BAD_REQUEST, message);
  }
}

export { BadRequestError };
