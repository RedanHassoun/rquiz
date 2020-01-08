import { Quiz } from './../../shared/models/quiz';
import { User } from './../../shared/models/user';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Injectable, OnDestroy } from '@angular/core';
import { first, filter, switchMap } from 'rxjs/operators';

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

  public onMessage(topic: string, messageHandler = jsonHandler): Observable<AppNotificationMessage> {
    return this.connect()
      .pipe(first())
      .pipe(switchMap((client: Stomp.Client) => {
        const that = this;
        return Observable.create((observer) => {
          const subscription: Stomp.Subscription = client.subscribe(`/topic${topic}`, (message: Stomp.Message) => {
            // observer.next(messageHandler(message ? message.body : null, topic));
            observer.next(messageHandler(message));
            return () => client.unsubscribe(subscription.id);
          });
        });
      }));
  }

  private notificationMessageHandler(message: string, topic: string): void {
    // TODO
    try {
      if (!this.currentUser) {
        return;
      }
      const msg = JSON.parse(message) as AppNotificationMessage;
      if (topic.toLowerCase() === TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()) {
        const quiz: Quiz = JSON.parse(msg.content);
        if (quiz.creator.id === this.currentUser.id) {
          
        }
      }
    } catch (ex) {
      console.error(`An error ocurred while handling error: ${ex.toString()}`);
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
    return of(1);
  }
}
