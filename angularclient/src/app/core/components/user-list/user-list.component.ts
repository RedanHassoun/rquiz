import { AppUtil } from './../../../shared/util/app-util';
import { AppError } from './../../../shared/app-errors/app-error';
import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../../shared/models/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[];

  constructor(private userService: UserServiceService,
    private router: Router) { }

  ngOnInit() {
    this.userService.getAll()
      .subscribe((data: User[]) => {
        this.users = data;
      }, (err: AppError) => AppUtil.showError);
  }

  showUser(user: User) {
    if (!user) {
      AppUtil.handleNullError('User');
    }

    this.router.navigate(['users', user.id]);
  }
}
