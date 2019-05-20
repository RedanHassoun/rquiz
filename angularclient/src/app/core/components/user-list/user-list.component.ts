import { UserServiceService } from '../../services/user-service.service';
import { User } from '../../../shared/models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[];

  constructor(private userService: UserServiceService) { }

  ngOnInit() {
    this.userService.getAll().subscribe(data => {
      this.users = data;
    });
  }

}
