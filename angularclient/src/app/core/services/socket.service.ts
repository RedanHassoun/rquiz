import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private readonly SOCKET_ENDPOINT = '/rquiz-websocket';
  private stompClient: Stomp.Client;

  constructor() { }

  public connect(topic: string, connectedCallback, errorCallback?) {
    const socket: WebSocket = new SockJS(this.SOCKET_ENDPOINT);

    this.stompClient = Stomp.over(socket);

    if (errorCallback) {
      this.stompClient.connect({}, connectedCallback, errorCallback);
    } else {
      this.stompClient.connect({}, connectedCallback);
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(undefined);
    }
  }
}
