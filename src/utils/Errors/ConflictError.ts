import { ErrorStatusCode } from '../../@types/types';

import { BaseError } from './BaseError';

class ConflictError extends BaseError {
  constructor(message: string) {
    super(ErrorStatusCode.CONFLICT, message);
  }
}

export { ConflictError };
