import { SuccessStatusCode } from '../@types/statusCodes';

type SuccessCodes = {
  [key in SuccessStatusCode]: number;
};

const successStatusCode: SuccessCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  DELETED: 204,
  UPDATED: 200,
};

export { successStatusCode };
