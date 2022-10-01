export interface InputUpdateTaskDto {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  userId: string;
}

export interface OutputUpdateTaskDto {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  updatedAt: Date;
}
