export interface IValidator<T> {
  validate(entity: T): void | never;
}
