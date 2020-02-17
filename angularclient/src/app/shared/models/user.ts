import { BaseModel } from './base-model';
export class User extends BaseModel {
    id: string;
    username: string;
    email: string;
    imageUrl: string;
    about: string;
    totalNumberOfAnswers: number;
    totalNumberOfCorrectAnswers: number;
}

