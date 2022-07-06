import { NotFoundError } from "restify-errors";

import type { ITasksRepository } from "../../../@types/interfaces";
import type { TaskIdentifierById } from "../../../@types/types";

import { TasksRepository } from "../repository/TasksRepository";

class IsTaskExistsConstraint {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async validate(userId: string, id: string) {
    const task = await this.tasksRepository.findById({
      userId,
      id,
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }
}

function IsTaskExists() {
  const constraint = new IsTaskExistsConstraint(new TasksRepository());

  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (args: TaskIdentifierById) {
      await constraint.validate(args.userId, args.id);

      return original.apply(this, [args]);
    };
  };
}

export { IsTaskExists };
