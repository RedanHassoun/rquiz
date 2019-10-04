import { UserService } from '../../services/user-service.service';
import { User } from '../../../shared/models/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
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
