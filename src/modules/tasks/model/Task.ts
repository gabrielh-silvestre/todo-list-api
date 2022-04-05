interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'DELETED';
  userId: string;
  updatedAt: Date;
}

export { Task };
