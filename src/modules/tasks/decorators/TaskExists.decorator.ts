import { NotFoundError } from "restify-errors";

import type { ITasksRepository } from "../../../@types/interfaces";
import type { TaskIdentifierById } from "../../../@types/types";

import { TasksRepository } from "../repository/TasksRepository";
import { Constraint } from "../../../shared/utils/Decorators/Constraint";

class IsTaskExistsConstraint extends Constraint<
  ITasksRepository,
  TaskIdentifierById
> {
  constructor() {
    super(new TasksRepository());
  }

  async validate({ id, userId }: TaskIdentifierById): Promise<void | never> {
    const task = await this.repository.findById({
      userId,
      id,
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }
}

export const IsTaskExists = new IsTaskExistsConstraint();