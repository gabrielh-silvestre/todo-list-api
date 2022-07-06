export interface IDecoratorConstraint<T> {
  validate(data: T): Promise<void | never>;
}
