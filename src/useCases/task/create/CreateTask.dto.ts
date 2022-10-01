export interface InputCreateTaskDto {
  title: string;
  description: string | null;
  userId: string;
}

export interface OutputCreateTaskDto {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  updatedAt: Date;
}
