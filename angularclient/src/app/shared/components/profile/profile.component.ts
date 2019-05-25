import { UserServiceService } from '../../../core/services/user-service.service';
import { AppUtil } from '../../util/app-util';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private user: User;
  private isCurrUser: boolean;

  constructor(private route: ActivatedRoute,
    private usersService: UserServiceService) {
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

  recognizeUser(user: User): void {
    const currUsername: string = AppUtil.getCurrentUsername();
    if (user.username === currUsername) {
      this.isCurrUser = true;
    } else {
      this.isCurrUser = false;
    }
  }
}
