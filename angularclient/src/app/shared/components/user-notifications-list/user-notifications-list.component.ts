import { AppNotificationMessage } from './../../models/app-notification-message';
import { switchMap } from 'rxjs/operators';
import { NavigationHelperService } from './../../services/navigation-helper.service';
import { AppUtil } from './../../util/app-util';
import { Router } from '@angular/router';
import { UserNotificationsService } from '../../../core/services/user-notifications.service';
import { createNotificationMessageText, createNotificationRouteUrl } from '../../util/socket-util';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription, of } from 'rxjs';

@Component({
  selector: 'app-user-notifications-list',
  templateUrl: './user-notifications-list.component.html',
  styleUrls: ['./user-notifications-list.component.scss']
})
export class UserNotificationsListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  notifications: AppNotificationMessage[] = [];

  constructor(private notificationService: UserNotificationsService,
    public dialogRef: MatDialogRef<UserNotificationsListComponent>,
    private router: Router,
    private navigationService: NavigationHelperService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.notificationService.myNotificationsList$
        .subscribe((notificationsList: AppNotificationMessage[]) => {
          this.notifications = notificationsList;
        })
    );
  }

  public getNotificationText(notification: AppNotificationMessage): string {
    return createNotificationMessageText(notification);
  }

  public navigateToPage(notification: AppNotificationMessage): void {
    notification.seen = true;
    this.subscriptions.push(
      this.notificationService.update(notification.id, notification).subscribe((res) => {
        this.notificationService.removeFromMyNotifications(notification);
        const url: string = createNotificationRouteUrl(notification);
        this.router.navigate([url], { replaceUrl: true });
        this.dialogRef.close();
      })
    );
  }

  clearAll(): void {
    this.subscriptions.push(
      this.navigationService
        .openYesNoDialogNoCallback('Are you sure you want to clear all notifications?')
        .pipe(switchMap(res => {
          if (res) {
            const toUpdate: Partial<AppNotificationMessage> = {
              seen: true
            };
            return this.notificationService.updateAllMyNotifications(toUpdate);
          }
          return of(null);
        }))
        .subscribe((res) => {
          if (res) {
            this.notificationService.resetMyNotifications();
          }
        }, (err: Error) => {
          AppUtil.showErrorMessage(err.message);
        })
    );
  }

  shouldShowClearAllButton(): boolean {
    return this.notifications && this.notifications.length > 0;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
