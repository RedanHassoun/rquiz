import { ROUTE_NAMES } from './app-consts';
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

export const SocketTopics = {
    TOPIC_QUIZ_LIST_UPDATE: '/quiz-list-update',
    TOPIC_QUIZ_ANSWERS_UPDATE: '/quiz-answers-update',
    TOPIC_QUIZ_DELETED_UPDATE: '/quiz-deleted-update',
    TOPIC_QUIZ_ASSIGNED_TO_USER: '/quiz-assigned-to-user',
    TOPIC_USER_UPDATE: '/user-update'
};

export function createNotificationMessageText(notification: AppNotificationMessage): string {
    if (!notification) {
        return '';
    }

    if (notification.topic.toLowerCase() === SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        const quiz: Quiz = JSON.parse(notification.content);
        return `${notification.username} solved your quiz: ${quiz.title}`;
    }

    if (notification.topic.toLowerCase() === SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()) {
        const quiz: Quiz = JSON.parse(notification.content);
        return `${notification.username} assigned a quiz to you. Quiz title: ${quiz.title}`;
    }

    return `You got a notification from user: ${notification.username}`;
}

export function createNotificationRouteUrl(notification: AppNotificationMessage): string {
    if (!notification) {
        return '';
    }

    if (notification.topic.toLowerCase() === SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        return ROUTE_NAMES.MY_QUIZ_LIST.name;
    }

    if (notification.topic.toLowerCase() === SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()) {
        return ROUTE_NAMES.MY_ASSIGNED_QUIZ_LIST.name;
    }

    return '/';
}
