import { Task } from '../../tasks/model/Task';

interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  tasks?: Task[];
}

export { User };
