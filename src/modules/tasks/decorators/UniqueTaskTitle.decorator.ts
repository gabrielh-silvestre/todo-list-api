import { ConflictError } from "restify-errors";

import type { ITasksRepository } from "../../../@types/interfaces";
import type { TaskIdentifierByTitle } from "../../../@types/types";

import { TasksRepository } from "../repository/TasksRepository";

class IsTaskUniqueConstraint {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async validate(userId: string, title: string) {
    const tasks = await this.tasksRepository.findByExactTitle({
      userId,
      title,
    });

    if (tasks.length > 0) {
      throw new ConflictError("Task with this title already exists");
    }
  }
}

function IsTaskTitleUnique() {
  const constraint = new IsTaskUniqueConstraint(new TasksRepository());

  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (args: TaskIdentifierByTitle) {
      await constraint.validate(args.userId, args.title);

      return original.apply(this, [args]);
    };
  };
}

export { IsTaskTitleUnique };
