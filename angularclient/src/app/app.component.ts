import { AppUtil } from './shared/util/app-util';
import { TOPIC_USER_UPDATE } from './core/common/socket-consts';
import { UserService } from './core/services/user-service.service';
import { switchMap, filter } from 'rxjs/operators';
import { ImageService } from './shared/services/image.service';
import { AppConsts } from './shared/util/app-consts';
import { UserNotificationsListComponent } from './shared/components/user-notifications-list/user-notifications-list.component';
import { Subscription } from 'rxjs';
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
  private subscriptions: Subscription[] = [];
  drawerOpened = false;
  appConsts: any = AppConsts; // TODO: make this more elegant
  appPages = new Map<string, string>([
    ['home', 'Home'],
    ['profile', 'My profile'],
    [this.appConsts.MY_QUIZ_LIST, 'My Quiz List'],
    [this.appConsts.MY_ASSIGNED_QUIZ_LIST, 'Assigned To Me'],
    ['users', 'Users'],
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
    this.subscriptions.push(
      this.notificationService.myNotificationsCount$.subscribe((notificationsCount: number) => {
        this.myNotificationsCount = notificationsCount;
      })
    );
    this.initCurrentUser();
    this.listenForUserChanges();
  }

  private initCurrentUser(): void {
    // TODO: fix the bug when the user logs out and logs in as another user
    this.usersService.getCurrentUserDetails()
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }

  private listenForUserChanges(): void {
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

    this.router.navigate(['users', user.id], { replaceUrl: true });
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
      case 'users':
        this.router.navigate(['users'], { replaceUrl: true });
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

    this.subscriptions.push(
      this.navigationService.openDialog(UserNotificationsListComponent).subscribe()
    );
  }
}
