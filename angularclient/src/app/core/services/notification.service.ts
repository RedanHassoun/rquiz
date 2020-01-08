import { Quiz } from './../../shared/models/quiz';
import { User } from './../../shared/models/user';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Injectable, OnDestroy } from '@angular/core';
import { first, filter, switchMap, map } from 'rxjs/operators';

import { AppNotificationMessage, TOPIC_QUIZ_ANSWERS_UPDATE } from './../model/socket-consts';
import { AppConsts } from './../../shared/util/app-consts';
import { SocketClientState, jsonHandler } from '../model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private static readonly URL = `${AppConsts.BASE_URL}${AppConsts.STOMP_ENDPOINT}`;
  private stompClient: Stomp.Client;
  private state: BehaviorSubject<SocketClientState>;
  private readonly RECONNECT_DELAY_SECS = 5;
  private currentUser: User;
  private myNotificationsSubject: BehaviorSubject<AppNotificationMessage[]>;

  constructor(private authService: AuthenticationService) {
    this.myNotificationsSubject = new BehaviorSubject<AppNotificationMessage[]>([]);
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.init(NotificationService.URL);
    this.authService.getCurrentUser()
      .then((user: User) => {
        this.currentUser = user;
      })
  }

  public onMessage(topic: string, messageHandler = this.notificationMessageHandler): Observable<AppNotificationMessage> {
    return this.connect()
      .pipe(first())
      .pipe(switchMap((client: Stomp.Client) => {
        const that = this;
        return Observable.create((observer) => {
          const subscription: Stomp.Subscription = client.subscribe(`/topic${topic}`, (message: Stomp.Message) => {
            observer.next(messageHandler(that, message ? message.body : null, topic));
            return () => client.unsubscribe(subscription.id);
          });
        });
      }));
  }

  private notificationMessageHandler(context: NotificationService, message: string, topic: string): any {
    try {
      if (!context.currentUser) {
        return JSON.parse(message);
      }
      const msg = JSON.parse(message) as AppNotificationMessage;
      if (topic.toLowerCase() === TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        const targetUserId: string = msg.targetUserId;
        if (targetUserId === context.currentUser.id) {
          const currNotificationData: AppNotificationMessage[] = context.myNotificationsSubject.value;
          const notificationFromMyList = currNotificationData.find(notification => notification.id === msg.id);
          if (!notificationFromMyList) {
            currNotificationData.push(msg);
            context.myNotificationsSubject.next(currNotificationData);
          }
        }
      }
      return JSON.parse(message);
    } catch (ex) {
      console.error(`An error ocurred while handling error: ${ex.toString()}`);
      throw ex;
    }
  }

  public send(message: AppNotificationMessage): void {
    this.connect()
      .pipe(first())
      .subscribe(client => client.send(`/rquiz-socket${message.topic}`, {}, JSON.stringify(message)));
  }

  private init(url: string): void {
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    const that = this;
    this.stompClient.connect({},
      (frame: Stomp.Frame) => {
        console.log('Connected to socket');
        that.state.next(SocketClientState.CONNECTED);
      },
      (error) => {
        that.state.next(SocketClientState.ERROR);
        console.error('Unable to connect to STOMP endpoint, error:', error);
        console.error(`Trying to connect again in ${this.RECONNECT_DELAY_SECS} seconds`);
        setTimeout(() => {
          that.init(NotificationService.URL);
        }, this.RECONNECT_DELAY_SECS * 1000);
      });
  }

  private connect(): Observable<Stomp.Client> {
    return new Observable<Stomp.Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED))
        .subscribe(() => {
          observer.next(this.stompClient);
        });
    });
  }

  ngOnDestroy(): void {
    this.connect()
      .pipe(first())
      .subscribe(client => client.disconnect(null));
  }

  get myNotificationsCount$(): Observable<number> {
    return this.myNotificationsSubject.asObservable().pipe(map((notificationData: AppNotificationMessage[]) => {
      if (!notificationData) {
        return 0;
      }
      return notificationData.length;
    }));
  }
}
