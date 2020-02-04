import { ClientDataService } from '../../shared/services/client-data.service';
import { User } from './../../shared/models/user';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Injectable, OnDestroy } from '@angular/core';
import { first, filter, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppNotificationMessage, TOPIC_QUIZ_ANSWERS_UPDATE, TOPIC_QUIZ_ASSIGNED_TO_USER, createNotificationMessageText } from './../model/socket-consts';
import { AppConsts } from './../../shared/util/app-consts';
import { SocketClientState } from '../model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ClientDataService implements OnDestroy {
  private static readonly URL = `${AppConsts.BASE_URL}${AppConsts.STOMP_ENDPOINT}`;
  private stompClient: Stomp.Client;
  private state: BehaviorSubject<SocketClientState>;
  private readonly RECONNECT_DELAY_SECS = 5;
  private currentUser: User;
  private myNotificationsSubject: BehaviorSubject<AppNotificationMessage[]>;
  private readonly URL_KEY_TARGET_USER = 'targetUserId';
  private readonly URL_KEY_SEEN = 'seen';

  constructor(private authService: AuthenticationService, public http: HttpClient) {
    super(`${AppConsts.BASE_URL}/api/v1/notifications/`, http);

    this.myNotificationsSubject = new BehaviorSubject<AppNotificationMessage[]>([]);
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.init(NotificationService.URL);
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
      if (topic.toLowerCase() === TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase() ||
        topic.toLowerCase() === TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()) {
        if (msg && msg.targetUserIds) {
          for (const targetUserId of msg.targetUserIds) {
            if (targetUserId === context.currentUser.id) {
              const currNotificationData: AppNotificationMessage[] = context.myNotificationsSubject.value;
              const notificationFromMyList = currNotificationData.find(notification => notification.id === msg.id);
              if (!notificationFromMyList) {
                currNotificationData.push(msg);
                context.myNotificationsSubject.next(currNotificationData);
              }
            }
          }
        }
      }
      return JSON.parse(message);
    } catch (ex) {
      console.error(`An error ocurred while handling error: ${ex.toString()}`);
      throw ex;
    }
  }

  public initMyNotification(): void {
    this.authService.getCurrentUser()
      .then((user: User) => {
        this.currentUser = user;
        this.getNotificaitonsListForUser(this.currentUser.id)
          .subscribe((notificationsList: AppNotificationMessage[]) => {
            this.addToMyNotifications(notificationsList);
          });
      });
  }

  public send(message: AppNotificationMessage): void {
    message.humanReadableContent = createNotificationMessageText(message);
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

  public getNotificaitonsListForUser(userId: string): Observable<AppNotificationMessage[]> {
    const filterParamMap: Map<string, string> = new Map<string, string>([
      [this.URL_KEY_TARGET_USER, userId],
      [this.URL_KEY_SEEN, 'false']]);

    return super.getAllByParameter(filterParamMap, null, null)
      .pipe(map((notifications: any) => {
        return notifications as AppNotificationMessage[];
      }));
  }

  public addToMyNotifications(notificaitonsToAdd: AppNotificationMessage[]): void {
    const currNotificationData: AppNotificationMessage[] = this.myNotificationsSubject.value;

    for (const notificaiton of notificaitonsToAdd) {
      const notificationFromMyList = currNotificationData.find(notification => notification.id === notificaiton.id);
      if (!notificationFromMyList) {
        currNotificationData.push(notificaiton);
      }
    }

    this.myNotificationsSubject.next(currNotificationData);
  }

  public removeFromMyNotifications(notificaitonToRemove: AppNotificationMessage): void {
    const currNotificationData: AppNotificationMessage[] = this.myNotificationsSubject.value;

    const indexOfNotification: number = currNotificationData.findIndex(notification => notification.id === notificaitonToRemove.id);
    if (indexOfNotification !== -1) {
      currNotificationData.splice(indexOfNotification, 1);
      this.myNotificationsSubject.next(currNotificationData);
    }
  }

  get myNotificationsList$(): Observable<AppNotificationMessage[]> {
    return this.myNotificationsSubject.asObservable();
  }

  get myNotificationsCount$(): Observable<number> {
    return this.myNotificationsSubject.asObservable()
      .pipe(map((notificationData: AppNotificationMessage[]) => {
        if (!notificationData) {
          return 0;
        }
        return notificationData.length;
      }));
  }
}
