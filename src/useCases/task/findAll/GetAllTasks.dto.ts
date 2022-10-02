export interface InputGetAllTasksDto {
  userId: string;
}

export interface OutputGetAllTasksDto {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  updatedAt: Date;
}
