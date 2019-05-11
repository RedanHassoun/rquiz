import { AccessDeniedError } from './../../common/access-denied-error';
import { AppError } from './../../common/app-error';
import { LoginMessage } from './../../models/login-message';
import { AppUtil } from './../../common/app-util';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;

  constructor(
    private router: Router,
    private authService: AuthenticationService) { }

  signIn(credentials: LoginMessage) {
    this.authService.login(credentials)
      .subscribe(response => {
        AppUtil.extractAndSaveToken(response);
        this.router.navigate(['/users']);
      }, (err: AppError) => {
        if (err instanceof AccessDeniedError) {
          this.invalidLogin = true;
          return;
        }
        alert('Something went wrong...');
      });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/users']);
    }
  }
}
