import { User } from './user';
export class Quiz {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
    assignedUsers: User[];
    creatorId: string;
}
