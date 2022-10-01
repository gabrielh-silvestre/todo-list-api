export interface ITask {
  get id(): string;
  get title(): string;
  get description(): string | null;
  get status(): "TODO" | "IN_PROGRESS" | "DONE";
  get userId(): string;
  get updatedAt(): Date;
}
