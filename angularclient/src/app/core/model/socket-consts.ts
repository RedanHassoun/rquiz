export enum SocketClientState {
    ATTEMPTING, CONNECTED, ERROR
}

export interface StompMessage {
    body: string;
}

export function jsonHandler(message: StompMessage): any {
    console.log('handling:', message);
    return JSON.parse(message.body);
}

export function textHandler(message: StompMessage): string {
    return message.body;
}

export class AppNotificationMessage {
    content: string;
    constructor(data: any) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        this.content = data;
    }
}

export const TOPIC_QUIZ_LIST_UPDATE = '/quiz-list-update';
export const TOPIC_QUIZ_ANSWERS_UPDATE = '/quiz-answers-update';
export const TOPIC_QUIZ_DELETED_UPDATE = '/quiz-deleted-update';
export const TOPIC_USER_UPDATE = '/user-update';
