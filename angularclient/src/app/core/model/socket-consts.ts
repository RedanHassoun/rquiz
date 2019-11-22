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
    content: any;
    constructor(data: any) {
        this.content = data;
    }
}
