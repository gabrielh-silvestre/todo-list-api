import { ErrorStatusCode } from '../../@types/types';

import { BaseError } from './BaseError';

class InternalError extends BaseError {
  constructor(message: string, error: any) {
    super(ErrorStatusCode.INTERNAL_SERVER_ERROR, message);

    console.log({
      message,
      errorPath: this.errorPath,
      error,
    });
  }
}

export { InternalError };
