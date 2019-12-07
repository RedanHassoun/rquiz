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
    private authService: AuthenticationService) {
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
}
