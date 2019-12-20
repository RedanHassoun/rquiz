import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon';
import { NotFoundError } from './../../app-errors/not-found-error';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user-service.service';
import { AppUtil } from '../../util/app-util';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public isCurrUser: boolean;

  constructor(private route: ActivatedRoute,
    private usersService: UserService,
    private authService: AuthenticationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
      this.iconRegistry.addSvgIcon( // TODO: make more general
        'edit',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/edit-24px.svg'));
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramsMap => {
      const userId = paramsMap.get('id');
      if (!userId) {
        AppUtil.handleNullError('User id');
        return;
      }

      this.usersService.get(userId)
        .subscribe((user: User) => {
          this.recognizeUser(user);
          this.user = user;
        }, (err: Error) => {
          if (err instanceof NotFoundError) {
            AppUtil.showWarningMessage('An error occurred, please login again.');
            this.authService.logout();
            return;
          }
          AppUtil.showWarningMessage('An error occurred');
        });
    });
  }

  async recognizeUser(user: User): Promise<void> {
    const currentUser: User = await this.authService.getCurrentUser();

    if (user.username === currentUser.username) {
      this.isCurrUser = true;
    } else {
      this.isCurrUser = false;
    }
  }

  editDetails(): void {
    // TODO : implement
  }
}
