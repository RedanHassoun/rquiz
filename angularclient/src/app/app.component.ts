import { User } from './shared/models/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  opened = false;
  appPages = new Map<string, string>([
    ['home', 'Home'],
    ['profile', 'My profile'],
    ['users', 'Users'],
    ['logout', 'Logout']
  ]);

  constructor(public authService: AuthenticationService,
              private router: Router,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon( // TODO: make more general
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-menu-24px.svg'));
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
      case 'users':
          this.router.navigate(['users'], { replaceUrl: true });
        break;
      case 'logout':
        this.authService.logout();
    }

    this.opened = false;
  }
}
