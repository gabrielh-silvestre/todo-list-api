import { BadRequestError, UnprocessableEntityError } from 'restify-errors';

const errorFormatter = (errorMessage: string) => {
  return errorMessage.includes('required')
    ? new BadRequestError(errorMessage)
    : new UnprocessableEntityError(errorMessage);
};

export { errorFormatter };
