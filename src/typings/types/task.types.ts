export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskAttributes = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  updatedAt: Date;
};

export type TaskCreateAttributes = Omit<
  TaskAttributes,
  "id" | "status" | "updatedAt"
>;

export type TaskUpdateAttributes = Omit<TaskAttributes, "updatedAt">;

export type TaskIdentifierByUser = { userId: string };

export type TaskIdentifierById = TaskIdentifierByUser & { id: string };

export type TaskIdentifierByTitle = TaskIdentifierByUser & { title: string };

export type TaskReturn = Omit<TaskAttributes, "userId">;
