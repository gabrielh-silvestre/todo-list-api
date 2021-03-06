import type { ITasksRepository } from "@projectTypes/interfaces";
import type { TaskIdentifierByTitle } from "@projectTypes/types";
import { ConflictError } from "restify-errors";

import { Constraint } from "@shared/utils/Decorators/Constraint";

import { TasksRepository } from "../repository/TasksRepository";

class IsTaskUniqueConstraint extends Constraint<
  ITasksRepository,
  TaskIdentifierByTitle
> {
  constructor() {
    super(new TasksRepository());
  }

  async validate({
    title,
    userId,
  }: TaskIdentifierByTitle): Promise<void | never> {
    const tasks = await this.repository.findByExactTitle({
      userId,
      title,
    });

    if (tasks.length > 0) {
      throw new ConflictError("Task with this title already exists");
    }
  }
}

export const IsTaskTitleUnique = new IsTaskUniqueConstraint();
