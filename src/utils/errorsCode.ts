import { ErrorStatusCode } from "../@types/statusCodes";

type ErrorCodes = {
  [key in ErrorStatusCode]: number;
};

const errorStatusCode: ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export { errorStatusCode };
