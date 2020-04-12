import { UserNotificationsService } from '../../core/services/user-notifications.service';
import { User } from './../models/user';
import { NavigationHelperService } from './navigation-helper.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ROUTE_NAMES } from './../util/app-consts';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {
  private currentPageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(ROUTE_NAMES.QUIZ_LIST.name);

  constructor(private router: Router,
    public authService: AuthenticationService,
    private navigationService: NavigationHelperService,
    private userNotificationsService: UserNotificationsService) { }

  public routeToPage(pageName: string): void {
    switch (pageName) {
      case ROUTE_NAMES.QUIZ_LIST.name:
        this.router.navigate([ROUTE_NAMES.QUIZ_LIST.name], { replaceUrl: true });
        break;
      case ROUTE_NAMES.PROFILE.name:
        this.openCurrentUserProfile();
        break;
      case ROUTE_NAMES.MY_QUIZ_LIST.name:
        this.router.navigate([ROUTE_NAMES.MY_QUIZ_LIST.name], { replaceUrl: true });
        break;
      case ROUTE_NAMES.MY_ASSIGNED_QUIZ_LIST.name:
        this.router.navigate([ROUTE_NAMES.MY_ASSIGNED_QUIZ_LIST.name], { replaceUrl: true });
        break;
      case ROUTE_NAMES.PEOPLE_LIST.name:
        this.router.navigate([ROUTE_NAMES.PEOPLE_LIST.name], { replaceUrl: true });
        break;
      case ROUTE_NAMES.LOGOUT.name:
        this.navigationService.openYesNoDialogNoCallback('Do you confirm logout?')
          .subscribe(res => {
            if (res) {
              this.authService.logout();
            }
          });
    }
    this.updateCurrentPage(pageName);
  }

  public updateCurrentPage(pageName: string): void {
    this.currentPageSubject.next(pageName);
  }

  private async openCurrentUserProfile(): Promise<void> {
    const user: User = await this.authService.getCurrentUser();

    this.router.navigate([ROUTE_NAMES.PEOPLE_LIST.name, user.id], { replaceUrl: true });
  }

  get currentPage$() {
    return this.currentPageSubject.asObservable();
  }

  public getRouteDisplayName(routeName: string): string {
    for (const currRoute of Object.keys(ROUTE_NAMES)) {
      if (ROUTE_NAMES[currRoute].name === routeName) {
        return ROUTE_NAMES[currRoute].display;
      }
    }
  }

  public enterMainPage(userId: string): void {
    const targetRoute = `/${ROUTE_NAMES.QUIZ_LIST.name}`;
    this.router.navigate([targetRoute]);
    this.updateCurrentPage(ROUTE_NAMES.QUIZ_LIST.name);
    this.userNotificationsService.initNotificationsForUser(userId);
  }
}
