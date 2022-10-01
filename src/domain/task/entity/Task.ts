import { TaskValidatorFactory } from "../factory/Task.validator.factory";
import { ITask } from "./Task.interface";

export class Task implements ITask {
  private _id: string;
  private _title: string;
  private _description: string | null;
  private _status: "TODO" | "IN_PROGRESS" | "DONE";
  private _userId: string;
  private _updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string | null,
    status: "TODO" | "IN_PROGRESS" | "DONE",
    userId: string,
    updatedAt: Date
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._status = status;
    this._userId = userId;
    this._updatedAt = updatedAt;

    this.validate();
  }

  private validate() {
    TaskValidatorFactory.create().validate(this);
  }

  public changeTitle(title: string): void {
    this._title = title;
    this._updatedAt = new Date();

    this.validate();
  }

  public changeDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();

    this.validate();
  }

  public changeStatus(status: "TODO" | "IN_PROGRESS" | "DONE"): void {
    this._status = status;
    this._updatedAt = new Date();

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get status(): "TODO" | "IN_PROGRESS" | "DONE" {
    return this._status;
  }

  get userId(): string {
    return this._userId;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
