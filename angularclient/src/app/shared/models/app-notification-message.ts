import { SocketTopics } from '../util';

export class AppNotificationMessage {
    id: string;
    content: string;
    topic: string;
    userId: string;
    username: string;
    time: Date;
    seen: boolean;
    targetUserIds: string[];

    constructor(data: any, topic: string, userId?: string, username?: string) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        this.content = data;
        this.userId = userId;
        this.username = username;
        this.topic = topic;
        this.targetUserIds = data.targetUserIds ? data.targetUserIds : null;
        this.time = new Date();
    }

    public isUserTargeted(userId: string): boolean {
        if (!userId || !this.targetUserIds) {
            return false;
        }
        for (const targetUserId of this.targetUserIds) {
            if (userId === targetUserId) {
                return true;
            }
        }
        return false;
    }

    public shouldAppearInUserNotifications(userId: string): boolean {
        if (!this.topic) {
            console.error(`Notification ${this.id} topic is undefined`);
            return false;
        }
        if (this.topic.toLowerCase() === SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase() ||
            this.topic.toLowerCase() === SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()) {
            if (this.isUserTargeted(userId)) {
                return true;
            }
        }
        return false;
    }
}
