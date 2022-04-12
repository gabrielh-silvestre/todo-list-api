type SuccessStatusCode =
  | 'OK'
  | 'CREATED'
  | 'ACCEPTED'
  | 'DELETED'
  | 'UPDATED';

interface ISuccess<T> {
  statusCode: SuccessStatusCode;
  data: T;
}

export { ISuccess, SuccessStatusCode };
