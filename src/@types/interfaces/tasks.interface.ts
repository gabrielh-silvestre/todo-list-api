import { Handler } from 'express';
import { TaskStatus } from '@prisma/client';

interface ITaskValidator {
  createValidation: Handler;
}

interface ITaskUserIdentifier {
  userId: string;
}

interface ITaskIdentifier {
  id: string;
}

interface IBasicTaskData {
  title: string;
  description: string | null;
  status?: TaskStatus;
}

interface ITaskIdentifierByUser extends ITaskUserIdentifier, ITaskIdentifier {}

export {
  ITaskValidator,
  ITaskUserIdentifier,
  ITaskIdentifier,
  IBasicTaskData,
  ITaskIdentifierByUser,
};
