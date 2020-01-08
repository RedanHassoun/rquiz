import { Observable, Subscription } from 'rxjs';
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
  appPages = new Map<string, string>([
    ['home', 'Home'],
    ['profile', 'My profile'],
    ['myquizlist', 'My Quiz List'],
    ['my-assigned-quiz-list', 'Assigned To Me'],
    ['users', 'Users'],
    ['logout', 'Logout']
  ]);
  myNotificationsCount: number;

  constructor(public authService: AuthenticationService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private navigationService: NavigationHelperService,
    private notificationService: NotificationService) {
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
        console.log('the count', notificationsCount);
        this.myNotificationsCount = notificationsCount;
      })
    );
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
      case 'myquizlist':
        this.router.navigate(['myquizlist'], { replaceUrl: true });
        break;
      case 'my-assigned-quiz-list':
        this.router.navigate(['my-assigned-quiz-list'], { replaceUrl: true });
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
}
