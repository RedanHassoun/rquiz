import { AppConsts } from './app-consts';
import { Quiz } from '../models/quiz';
import { AppNotificationMessage } from '../models/app-notification-message';

export enum SocketClientState {
    ATTEMPTING, CONNECTED, ERROR
}

export interface StompMessage {
    body: string;
}

export function textHandler(message: StompMessage): string {
    return message.body;
}

export const TOPIC_QUIZ_LIST_UPDATE = '/quiz-list-update';
export const TOPIC_QUIZ_ANSWERS_UPDATE = '/quiz-answers-update';
export const TOPIC_QUIZ_DELETED_UPDATE = '/quiz-deleted-update';
export const TOPIC_QUIZ_ASSIGNED_TO_USER = '/quiz-assigned-to-user';
export const TOPIC_USER_UPDATE = '/user-update';
export const ACTIVE_TOPICS = [
    TOPIC_QUIZ_LIST_UPDATE, TOPIC_QUIZ_ANSWERS_UPDATE, TOPIC_QUIZ_DELETED_UPDATE,
    TOPIC_QUIZ_ASSIGNED_TO_USER, TOPIC_USER_UPDATE
];

export function createNotificationMessageText(notification: AppNotificationMessage): string {
    if (!notification) {
        return '';
    }

    if (notification.topic.toLowerCase() === TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        const quiz: Quiz = JSON.parse(notification.content);
        return `${notification.username} solved your quiz: ${quiz.title}`;
    }

    if (notification.topic.toLowerCase() === TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()) {
        const quiz: Quiz = JSON.parse(notification.content);
        return `${notification.username} assigned a quiz to you. Quiz title: ${quiz.title}`;
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

    if (notification.topic.toLowerCase() === TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()) {
        return AppConsts.MY_ASSIGNED_QUIZ_LIST;
    }

    return '/';
}
