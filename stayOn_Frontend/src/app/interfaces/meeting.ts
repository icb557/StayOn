import { User } from './user';

export interface Meeting {
  id: number;
  title: string;
  description: string;
  url: string;
  userId: number;
  activa: boolean;
  fechaReunion: string; // Nuevo campo agregado
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  User?: User;
}
