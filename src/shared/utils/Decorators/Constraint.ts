import { IDecoratorConstraint } from "@projectTypes/interfaces";

abstract class Constraint<R, T> implements IDecoratorConstraint<T> {
  constructor(protected readonly repository: R) {}

  abstract validate(args: T): Promise<void | never>;
}

export { Constraint };
