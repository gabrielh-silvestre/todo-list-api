import { ErrorStatusCode } from '../../@types/types';

class BaseError extends Error {
  private errorCode: ErrorStatusCode;
  protected errorPath: string;

  constructor(errorCode: ErrorStatusCode, message: string) {
    super(message);
    this.errorCode = errorCode;
    this.errorPath = __filename;
  }

  getBody() {
    return {
      errorCode: this.errorCode,
      message: this.message,
    };
  }
}

export { BaseError };
