import { AppUtil } from './../../util/app-util';
import { Router } from '@angular/router';
import { NotificationService } from './../../../core/services/notification.service';
import { AppNotificationMessage, createNotificationMessageText, createNotificationRouteUrl } from './../../../core/model/socket-consts';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-notifications-list',
  templateUrl: './user-notifications-list.component.html',
  styleUrls: ['./user-notifications-list.component.scss']
})
export class UserNotificationsListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  notifications: AppNotificationMessage[] = [];

  constructor(private notificationService: NotificationService,
    public dialogRef: MatDialogRef<UserNotificationsListComponent>,
    private router: Router) { }

  ngOnInit() {
    this.subscriptions.push(
      this.notificationService.myNotificationsList$
        .subscribe((notificationsList: AppNotificationMessage[]) => {
          this.notifications = notificationsList;
        })
    );
  }

  public getNotificationText(notification: AppNotificationMessage): string {
    return notification.humanReadableContent;
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

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
