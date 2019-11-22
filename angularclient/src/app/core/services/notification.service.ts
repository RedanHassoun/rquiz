import { BehaviorSubject, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Injectable, OnDestroy } from '@angular/core';
import { first, filter, switchMap } from 'rxjs/operators';

import { AppNotificationMessage } from './../model/socket-consts';
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

  constructor() {
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.init(NotificationService.URL);
  }

  public onMessage(topic: string, messageHandler = jsonHandler): Observable<AppNotificationMessage> {
    return this.connect()
      .pipe(first())
      .pipe(switchMap((client: Stomp.Client) => {
        const that = this;
        return Observable.create((observer) => {
          const subscription: Stomp.Subscription = client.subscribe(`/topic${topic}`, (message) => {
            observer.next(messageHandler(message));
            return () => client.unsubscribe(subscription.id);
          });
        });
      }));
  }

  public send(topic: string, message: AppNotificationMessage): void {
    this.connect()
      .pipe(first())
      .subscribe(client => client.send(`/rquiz-socket${topic}`, {}, JSON.stringify(message)));
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
}
