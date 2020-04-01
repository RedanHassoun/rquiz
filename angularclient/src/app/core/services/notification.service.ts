import { SocketTopics, SocketClientState } from './../../shared/util/socket-util';
import { AppNotificationMessage } from './../../shared/index';
import { AppUtil } from './../../shared/util/app-util';
import { CoreUtil } from './../common/core-util';
import { ClientDataService } from '../../shared/services/client-data.service';
import { User } from './../../shared/models/user';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BehaviorSubject, Observable, throwError, of, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Injectable, OnDestroy } from '@angular/core';
import { first, filter, switchMap, map, catchError, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from './../../shared/util/app-consts';


@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ClientDataService implements OnDestroy {
  private static readonly URL = `${AppConsts.BASE_URL}${AppConsts.STOMP_ENDPOINT}`;
  private stompClient: Stomp.Client;
  private sockectState: BehaviorSubject<SocketClientState>;
  private readonly RECONNECT_DELAY_SECS = 5;
  private currentUser: User;
  private myNotificationsListSubject: BehaviorSubject<AppNotificationMessage[]>;
  private readonly URL_KEY_TARGET_USER = 'targetUserId';
  private readonly URL_KEY_SEEN = 'seen';
  private readonly stompTopicSubscriptionSubjects = new Map<string, Subject<any>>();

  constructor(private authService: AuthenticationService, public http: HttpClient) {
    super(`${AppConsts.BASE_URL}/api/v1/notifications/`, http);
    for (const topicKey of Object.keys(SocketTopics)) {
      this.stompTopicSubscriptionSubjects.set(SocketTopics[topicKey], new Subject<any>());
    }
    this.myNotificationsListSubject = new BehaviorSubject<AppNotificationMessage[]>([]);
    this.sockectState = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.initSocketConnection(NotificationService.URL);
    this.initNotificationsForCurrentUser();
    this.listenToAllTopics();
  }

  public initNotificationsForUser(userId: string): void {
    this.resetMyNotifications();
    if (!AppUtil.hasValue(userId)) {
      return;
    }
    this.getNotificaitonsListForUser(userId)
      .pipe(take(1))
      .subscribe((notificationsList: AppNotificationMessage[]) => {
        this.addToMyNotifications(notificationsList);
      }, (err: Error) => {
        AppUtil.showErrorMessage(`Cannot load notifications list`);
        this.authService.logout();
      });
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

  private initNotificationsForCurrentUser(): void {
    this.authService.currentUser$
      .subscribe((user: User) => {
        this.currentUser = user;
        this.initNotificationsForUser(this.currentUser ? this.currentUser.id : null);
      }, (err: User) => {
        AppUtil.showErrorMessage(AppConsts.SESSION_EXPIRED_ERROR);
        this.authService.logout();
      });
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

  private handleNotificationFromTopic(message: string, topic: string): void {
    const topicSubject: Subject<any> = this.stompTopicSubscriptionSubjects.get(topic);
    if (AppUtil.hasValue(topicSubject)) {
      topicSubject.next(message);
    }

    try {
      const appNotificationMessage = message ? JSON.parse(message) as AppNotificationMessage : null;
      Object.setPrototypeOf(appNotificationMessage, AppNotificationMessage.prototype);
      this.updateCurrentUserNotificationsIfNecessary.call(this, appNotificationMessage);
    } catch (ex) { }
  }

  private updateCurrentUserNotificationsIfNecessary(message: AppNotificationMessage): void {
    try {
      if (!message || !this.currentUser) {
        return null;
      }

      if (message && message.targetUserIds && message.shouldAppearInUserNotifications(this.currentUser.id)) {
        this.addToMyNotifications([message]);
      }
    } catch (ex) {
      const messageToString = message.content ? JSON.stringify(message.content) : null;
      console.error(
        `An error ocurred while handling notification message: ${messageToString}. Error: ${ex.toString()}`);
      throw ex;
    }
  }

  private jsonHandler(messageString: string): any {
    if (!messageString) {
      return null;
    }

    return JSON.parse(messageString);
  }

  public send(message: AppNotificationMessage): void {
    if (!AppUtil.hasValue(message.topic)) {
      throw new Error('Cannot sent message because topic is not defined');
    }
    this.connectToSocket()
      .pipe(first())
      .subscribe(client => client.send(`/rquiz-socket${message.topic}`, {}, JSON.stringify(message)));
  }

  private initSocketConnection(url: string): void {
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({},
      (frame: Stomp.Frame) => this.socketConnectedCallback.call(this, frame),
      (error) => this.socketFailedToConnectCallback.call(this, error));
  }

  private socketConnectedCallback(frame: Stomp.Frame): void {
    this.sockectState.next(SocketClientState.CONNECTED);
  }

  private socketFailedToConnectCallback(error: string | Stomp.Frame): void {
    this.sockectState.next(SocketClientState.ERROR);
    console.error('Unable to connect to STOMP endpoint, error:', error);
    console.error(`Trying to connect again in ${this.RECONNECT_DELAY_SECS} seconds`);
    setTimeout(() => {
      this.initSocketConnection(NotificationService.URL);
    }, this.RECONNECT_DELAY_SECS * 1000);
  }

  private connectToSocket(): Observable<Stomp.Client> {
    return this.sockectState
      .pipe(filter(state => state === SocketClientState.CONNECTED))
      .pipe(switchMap((state: SocketClientState) => {
        return of(this.stompClient);
      }));
  }

  ngOnDestroy(): void {
    this.connectToSocket()
      .pipe(first())
      .subscribe((client: Stomp.Client) => client.disconnect(null));
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
    const currNotificationData: AppNotificationMessage[] = this.myNotificationsListSubject.value;

    for (const notificaiton of notificaitonsToAdd) {
      const notificationFromMyList = currNotificationData.find(notification => notification.id === notificaiton.id);
      if (!notificationFromMyList) {
        currNotificationData.unshift(notificaiton);
      }
    }

    this.myNotificationsListSubject.next(currNotificationData);
  }

  public removeFromMyNotifications(notificaitonToRemove: AppNotificationMessage): void {
    const currNotificationData: AppNotificationMessage[] = this.myNotificationsListSubject.value;

    const indexOfNotification: number = currNotificationData.findIndex(notification => notification.id === notificaitonToRemove.id);
    if (indexOfNotification !== -1) {
      currNotificationData.splice(indexOfNotification, 1);
      this.myNotificationsListSubject.next(currNotificationData);
    }
  }

  get myNotificationsList$(): Observable<AppNotificationMessage[]> {
    return this.myNotificationsListSubject.asObservable();
  }

  get myNotificationsCount$(): Observable<number> {
    return this.myNotificationsListSubject.asObservable()
      .pipe(map((notificationData: AppNotificationMessage[]) => {
        if (!notificationData) {
          return 0;
        }
        return notificationData.length;
      }));
  }

  public resetMyNotifications(): void {
    this.myNotificationsListSubject.next([]);
  }

  public updateAllMyNotifications(patchRequestObj: Partial<AppNotificationMessage>): Observable<any> {
    if (!this.currentUser) {
      throwError('Cannot update all notifications, please try again later');
    }
    patchRequestObj.targetUserIds = [this.currentUser.id];
    const url = `${this.url}targetUser/${this.currentUser.id}`;
    return this.http.patch(url, patchRequestObj, { headers: CoreUtil.createAuthorizationHeader(), observe: 'response' })
      .pipe(catchError(AppUtil.handleError));
  }
}
