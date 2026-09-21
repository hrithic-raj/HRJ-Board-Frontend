export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avatarColor?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User;
  inviteToken: string;
  color: string;
  myRole?: 'owner' | 'member';
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  _id: string;
  project: string;
  title: string;
  order: number;
  color: string;
}

export type ItemPriority = 'low' | 'medium' | 'high';

export interface Item {
  _id: string;
  project: string;
  board: string;
  title: string;
  description: string;
  order: number;
  priority: ItemPriority;
  assignedTo?: User | null;
  dueDate?: string | null;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  _id: string;
  project: string;
  user: User;
  role: 'owner' | 'member';
  joinedAt: string;
}
