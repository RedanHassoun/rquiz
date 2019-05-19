import { UserServiceService } from './../../services/user-service.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserServiceService) {
    this.user = new User();
  }

  ngOnInit() {
  }


  onSubmit() {
    this.userService.create(this.user).subscribe(result => this.gotoUserList());
  }

  gotoUserList() {
    this.router.navigate(['/users']);
  }

}
