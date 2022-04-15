import { ErrorStatusCode } from '../@types/types';

class CustomError extends Error {
  constructor(public statusCode: ErrorStatusCode, public message: string) {
    super(
      JSON.stringify({
        statusCode,
        message,
      })
    );
  }
}

export { CustomError };
