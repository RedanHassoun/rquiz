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
        this.time = new Date();
    }
}