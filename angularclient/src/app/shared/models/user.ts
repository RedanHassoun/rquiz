import { BaseModel } from './base-model';
export class User extends BaseModel {
    public static readonly SEARCHABLE_FIELD_USERNAME = 'username';
    id: string;
    username: string;
    email: string;
    imageUrl: string;
    about: string;
    totalNumberOfAnswers: number;
    totalNumberOfCorrectAnswers: number;
}
