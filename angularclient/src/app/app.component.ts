import { AppUtil } from './shared/util/app-util';
import { TOPIC_USER_UPDATE } from './core/common/socket-consts';
import { UserService } from './core/services/user-service.service';
import { switchMap, filter } from 'rxjs/operators';
import { ImageService } from './shared/services/image.service';
import { AppConsts } from './shared/util/app-consts';
import { UserNotificationsListComponent } from './shared/components/user-notifications-list/user-notifications-list.component';
import { of } from 'rxjs';
import { NavigationHelperService } from './shared/services/navigation-helper.service';
import { User } from './shared/models/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  drawerOpened = false;
  appConsts: any = AppConsts; // TODO: make this more elegant
  appPages = new Map<string, string>([
    ['home', 'Home'],
    ['profile', 'My profile'],
    [this.appConsts.MY_QUIZ_LIST, this.appConsts.MY_QUIZ_LIST_DISPLAY],
    [this.appConsts.MY_ASSIGNED_QUIZ_LIST, this.appConsts.MY_ASSIGNED_QUIZ_LIST_DISPLAY],
    [this.appConsts.PEOPLE_LIST, this.appConsts.PEOPLE_LIST_DISPLAY],
    ['logout', 'Logout']
  ]);
  myNotificationsCount: number;
  currentUser: User;

  constructor(public authService: AuthenticationService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private navigationService: NavigationHelperService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private usersService: UserService) {
    this.iconRegistry.addSvgIcon( // TODO: make more general
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-menu-24px.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'bell',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/notifications-24px.svg'));
  }

  ngOnInit(): void {
    this.notificationService.myNotificationsCount$.subscribe((notificationsCount: number) => {
      this.myNotificationsCount = notificationsCount;
    });

    this.authService.currentUser$
      .pipe(switchMap((user: User) => {
        if (!user) {
          return of(null);
        }
        return this.usersService.getUserDetails(user.id, user);
      }))
      .subscribe((user: User) => {
        this.currentUser = user;
      },
        (err: Error) => {
          this.currentUser = null;
        });

    this.listenForUserNotifications();
  }

  private listenForUserNotifications(): void {
    this.notificationService.onMessage(TOPIC_USER_UPDATE)
      .pipe(filter(message => AppUtil.isNotificationForCurrentUserUpdate(message, this.currentUser)))
      .pipe(switchMap(message => {
        return this.usersService.get(message.content);
      }))
      .subscribe((user: User) => {
        this.currentUser = user;
      },
        async err => {
          this.currentUser = await this.authService.getCurrentUser();
        });
  }

  public getUserImageUrl(): string {
    return this.imageService.getImageUrlForUser(this.currentUser);
  }

  async openCurrentUserProfile() {
    const user: User = await this.authService.getCurrentUser();

    this.router.navigate([AppConsts.PEOPLE_LIST, user.id], { replaceUrl: true });
  }

  goToPage(pageName: string): void {
    switch (pageName) {
      case 'home':
        this.router.navigate(['quizList'], { replaceUrl: true });
        break;
      case 'profile':
        this.openCurrentUserProfile();
        break;
      case AppConsts.MY_QUIZ_LIST:
        this.router.navigate([AppConsts.MY_QUIZ_LIST], { replaceUrl: true });
        break;
      case AppConsts.MY_ASSIGNED_QUIZ_LIST:
        this.router.navigate([AppConsts.MY_ASSIGNED_QUIZ_LIST], { replaceUrl: true });
        break;
      case AppConsts.PEOPLE_LIST:
        this.router.navigate([AppConsts.PEOPLE_LIST], { replaceUrl: true });
        break;
      case 'logout':
        this.navigationService
          .openYesNoDialogNoCallback('Do you confirm logout?')
          .subscribe(res => {
            if (res) {
              this.authService.logout();
            }
          });
    }

    this.drawerOpened = false;
  }

  public openUserNotificationsListDialog() {
    if (!this.myNotificationsCount) {
      return;
    }

    this.navigationService.openDialog(UserNotificationsListComponent).subscribe();
  }
}
