import { CoreUtil } from './../../core/common/core-util';
import { UserNotificationsService } from '../../core/services/user-notifications.service';
import { AppUtil } from './../util/app-util';
import { first, filter, switchMap, map, catchError, take } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { AppNotificationMessage } from './../models/app-notification-message';
import { User } from './../models/user';
import { BehaviorSubject, Observable, throwError, of, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { SocketClientState, SocketTopics } from './../util/socket-util';
import { AppConsts } from './../util';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private static readonly URL = `${AppConsts.BASE_URL}${AppConsts.STOMP_ENDPOINT}`;
  private stompClient: Stomp.Client;
  private sockectState: BehaviorSubject<SocketClientState>;
  private readonly RECONNECT_DELAY_SECS = 5;
  private readonly stompTopicSubscriptionSubjects = new Map<string, Subject<any>>();

  constructor(private notificationService: UserNotificationsService) {
    for (const topicKey of Object.keys(SocketTopics)) {
      this.stompTopicSubscriptionSubjects.set(SocketTopics[topicKey], new Subject<any>());
    }

    this.sockectState = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.initSocketConnection(WebSocketService.URL);
    this.listenToAllTopics();
  }

  public send(message: AppNotificationMessage): void {
    if (!AppUtil.hasValue(message.topic)) {
      throw new Error('Cannot sent message because topic is not defined');
    }
    this.connectToSocket()
      .pipe(first())
      .subscribe(client => client.send(`/rquiz-socket${message.topic}`, {}, JSON.stringify(message)));
  }

  public onMessage(topic: string, messageHandler = this.jsonHandler, ignoreErrors = true): Observable<AppNotificationMessage> {
    const topicSubject: Subject<any> = this.stompTopicSubscriptionSubjects.get(topic);
    if (!topicSubject) {
      console.error(`Cannot find subscription for topic ${topic}`);
      return of(null);
    }
    return topicSubject.asObservable()
      .pipe(switchMap(message => {
        return of(message)
        .pipe(map((msg: string) => {
          return messageHandler.call(this, msg);
        }),
        catchError(error => {
          if (ignoreErrors === true) {
            return of(null);
          }
          return throwError(error);
        })
        );
      }));
  }

  private initSocketConnection(url: string): void {
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({},
      (frame: Stomp.Frame) => this.socketConnectedCallback.call(this, frame),
      (error) => this.socketFailedToConnectCallback.call(this, error));
  }

  private listenToAllTopics(): void {
    this.connectToSocket()
      .pipe(first())
      .subscribe((stompClient: Stomp.Client) => {
        const stompTopicsIterator = this.stompTopicSubscriptionSubjects.keys();
        let currTopic: string = stompTopicsIterator.next().value;

        while (AppUtil.hasValue(currTopic)) {
          const subscription: Stomp.Subscription = stompClient.subscribe(`/topic${currTopic}`, (message: Stomp.Message) => {
            const messageDestination: string = message ? message.headers['destination'] : null;
            const topic: string = messageDestination ? CoreUtil.removePrefix(messageDestination, '/topic') : '';
            this.handleNotificationFromTopic(message ? message.body : null, topic);
          });
          currTopic = stompTopicsIterator.next().value;
        }
      });
  }

  private connectToSocket(): Observable<Stomp.Client> {
    return this.sockectState
      .pipe(filter(state => state === SocketClientState.CONNECTED))
      .pipe(switchMap((state: SocketClientState) => {
        return of(this.stompClient);
      }));
  }

  private socketConnectedCallback(frame: Stomp.Frame): void {
    this.sockectState.next(SocketClientState.CONNECTED);
  }

  ngOnDestroy(): void {
    this.connectToSocket()
      .pipe(first())
      .subscribe((client: Stomp.Client) => client.disconnect(null));
  }

  private handleNotificationFromTopic(message: string, topic: string): void {
    const topicSubject: Subject<any> = this.stompTopicSubscriptionSubjects.get(topic);
    if (AppUtil.hasValue(topicSubject)) {
      topicSubject.next(message);
    }

    try {
      const appNotificationMessage = message ? JSON.parse(message) as AppNotificationMessage : null;
      Object.setPrototypeOf(appNotificationMessage, AppNotificationMessage.prototype);
      this.notificationService.updateCurrentUserNotificationsIfNecessary(appNotificationMessage);
    } catch (ex) { }
  }

  private jsonHandler(messageString: string): any {
    if (!messageString) {
      return null;
    }

    return JSON.parse(messageString);
  }

  private socketFailedToConnectCallback(error: string | Stomp.Frame): void {
    this.sockectState.next(SocketClientState.ERROR);
    console.error('Unable to connect to STOMP endpoint, error:', error);
    console.error(`Trying to connect again in ${this.RECONNECT_DELAY_SECS} seconds`);
    setTimeout(() => {
      this.initSocketConnection(WebSocketService.URL);
    }, this.RECONNECT_DELAY_SECS * 1000);
  }
}
