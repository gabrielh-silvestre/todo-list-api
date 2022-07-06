type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

type Attributes = {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  userId: string;
  updatedAt: Date;
};

type CreateAttributes = Omit<Attributes, 'id' | 'status' | 'updatedAt'>;

type UpdateAttributes = Omit<Attributes, 'updatedAt'>;

type UserIdentifier = { userId: string };

type Identifier = UserIdentifier & { id: string };

type TitleIdentifier = UserIdentifier & { title: string };

type Return = Omit<Attributes, 'userId'>;

export type TaskAttributes = Attributes;
export type TaskCreateAttributes = CreateAttributes;
export type TaskUpdateAttributes = UpdateAttributes;

export type TaskIdentifierByUser = UserIdentifier;
export type TaskIdentifierById = Identifier;
export type TaskIdentifierByTitle = TitleIdentifier;

export type TaskStatus = Status;
export type TaskReturn = Return;
