import { AuthenticationService } from './../../../core/services/authentication.service';
import { UserServiceService } from '../../../core/services/user-service.service';
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
  private user: User;
  private isCurrUser: boolean;

  constructor(private route: ActivatedRoute,
    private usersService: UserServiceService,
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
