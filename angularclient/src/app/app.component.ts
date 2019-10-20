import { NavigationHelperService } from './shared/services/navigation-helper.service';
import { User } from './shared/models/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  drawerOpened = false;
  appPages = new Map<string, string>([
    ['home', 'Home'],
    ['profile', 'My profile'],
    ['myquizlist', 'My Quiz List'],
    ['my-assigned-quiz-list', 'Assigned To Me'],
    ['users', 'Users'],
    ['logout', 'Logout']
  ]);

  constructor(public authService: AuthenticationService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private navigationService: NavigationHelperService) {
    this.iconRegistry.addSvgIcon( // TODO: make more general
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-menu-24px.svg'));
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
