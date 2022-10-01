import { IRepository } from "src/domain/shared/repository/repository.interface";
import { Task } from "../entity/Task";

export interface ITaskRepository
  extends Omit<IRepository<Task>, "findAll" | "find"> {
  findAll(userId: string): Promise<Task[]>;
  find(userId: string, id: string): Promise<Task | null>;
  findByTitle(userId: string, title: string): Promise<Task | null>;
  delete(userId: string, id: string): Promise<void>;
}
