import { IRepository } from "src/domain/shared/repository/repository.interface";
import { Task } from "../entity/Task";

export interface TaskRepository
  extends Omit<IRepository<Task>, "findAll" | "find"> {
  findAll(userId: string): Promise<Task[]>;
  find(userId: string, id: string): Promise<Task>;
  findByTitle(userId: string, title: string): Promise<Task>;
}
