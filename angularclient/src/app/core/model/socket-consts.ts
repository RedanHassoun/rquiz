import { AppConsts } from './../../shared/util/app-consts';
import { MY_QUIZ_LIST } from './../../routing/app-routing.module';
import { Quiz } from './../../shared/models/quiz';
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
    id: string;
    content: string;
    topic: string;
    userId: string;
    username: string;
    time: Date;
    seen: boolean;
    targetUserId: string;

    constructor(data: any, topic: string, userId?: string, username?: string) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        this.content = data;
        this.userId = userId;
        this.username = username;
        this.topic = topic;
        this.time = new Date();
    }
}

export const TOPIC_QUIZ_LIST_UPDATE = '/quiz-list-update';
export const TOPIC_QUIZ_ANSWERS_UPDATE = '/quiz-answers-update';
export const TOPIC_QUIZ_DELETED_UPDATE = '/quiz-deleted-update';
export const TOPIC_USER_UPDATE = '/user-update';

export function createNotificationMessageText(notification: AppNotificationMessage): string {
    if (!notification) {
        return '';
    }

    if (notification.topic.toLowerCase() === TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        const quiz: Quiz = JSON.parse(notification.content);
        return `User ${notification.username} solved one of your quiz: ${quiz.title}`;
    }

    return `You got a notification from user: ${notification.username}`;
}

export function createNotificationRouteUrl(notification: AppNotificationMessage): string {
    if (!notification) {
        return '';
    }

    if (notification.topic.toLowerCase() === TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        return AppConsts.MY_QUIZ_LIST;
    }

    return '/';
}
