import { AppMenuService } from './shared/services/app-menu.service';
import { ScssStyleService } from './shared/services/scss-style.service';
import { UserService } from './core/services/user-service.service';
import { switchMap, filter } from 'rxjs/operators';
import { ImageService } from './shared/services/image.service';
import { ROUTE_NAMES, AppUtil, SocketTopics } from './shared/util';
import { UserNotificationsListComponent } from './shared/components/user-notifications-list/user-notifications-list.component';
import { of } from 'rxjs';
import { NavigationHelperService } from './shared/services/navigation-helper.service';
import { User } from './shared/models/user';
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
  public drawerOpened = false;
  public routeNames: any = ROUTE_NAMES; // TODO: make this more elegant
  public selectedPage: string;
  public myNotificationsCount: number;
  public currentUser: User;

  constructor(public authService: AuthenticationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private navigationService: NavigationHelperService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private usersService: UserService,
    private scssStyleService: ScssStyleService,
    private appMenuService: AppMenuService) {
  }

  ngOnInit(): void {
    this.initIcons();
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
    this.appMenuService.currentPage$.subscribe((pageName: string) => this.selectedPage = pageName);
  }

  private listenForUserNotifications(): void {
    this.notificationService.onMessage(SocketTopics.TOPIC_USER_UPDATE)
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

  public goToPage(pageName: string): void {
    this.appMenuService.routeToPage(pageName);
    this.drawerOpened = false;
  }

  public openUserNotificationsListDialog(): void {
    if (!this.myNotificationsCount) {
      return;
    }

    this.navigationService.openDialog(UserNotificationsListComponent).subscribe();
  }

  public getRouteDisplayName(routeName: string): string {
    return this.appMenuService.getRouteDisplayName(routeName);
  }

  public getListItemStyle(page: string): any {
    if (page === this.selectedPage) {
      return {
        color: this.scssStyleService.getVariableData('$app-primary-color'),
        fontWeight: 'bold'
      };
    }
    return {
      color: 'black',
      fontWeight: 'normal'
    };
  }

  private initIcons(): void {
    this.iconRegistry.addSvgIcon( // TODO: make more general
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-menu-24px.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'bell',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/notifications-24px.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'home',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/home-black-18dp.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'person',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/person-black-18dp.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'assignment_return',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/assignment_return-black-18dp.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'assignment',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/assignment-black-18dp.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'people',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/supervisor_account-black-18dp.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'exit_to_app',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/exit_to_app-black-18dp.svg'));
  }
}
