import type {
  IDecoratorConstraint,
  ITasksRepository,
} from "../../../@types/interfaces";

function IsTaskValid<T>(constraint: IDecoratorConstraint<ITasksRepository, T>) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (args: T) {
      await constraint.validate(args);

      return original.apply(this, [args]);
    };
  };
}

export { IsTaskValid };
export * from "./TaskExists.decorator";
export * from "./UniqueTaskTitle.decorator";
