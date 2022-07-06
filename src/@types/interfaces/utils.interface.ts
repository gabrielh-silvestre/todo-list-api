interface DecoratorConstraint<R, T> {
  validate(data: T): Promise<void | never>;
}

export type IDecoratorConstraint<R, T> = DecoratorConstraint<R, T>;
