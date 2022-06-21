type Success<T> = {
  statusCode: number;
  data: T;
}

export type SuccessCase<T> = Success<T>;
