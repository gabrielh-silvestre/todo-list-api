import type { ITasksRepository } from "@projectTypes/interfaces";
import type { TaskIdentifierById } from "@projectTypes/types";
import { NotFoundError } from "restify-errors";

import { Constraint } from "@shared/utils/Decorators/Constraint";

import { TasksRepository } from "../repository/TasksRepository";

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
