import { v4 as uuid } from "uuid";

import { Task } from "../entity/Task";

export class TaskFactory {
  public static create(title: string, userId: string) {
    return new Task(uuid(), title, null, "TODO", userId, new Date());
  }

  public static createWithDescription(
    title: string,
    description: string,
    userId: string
  ) {
    return new Task(uuid(), title, description, "TODO", userId, new Date());
  }
}
