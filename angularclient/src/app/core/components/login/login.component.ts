import { AccessDeniedError } from './../../../shared/app-errors/access-denied-error';
import { LoginMessage } from '../../../shared/models/login-message';
import { AppUtil } from '../../../shared/util/app-util';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
        this.router.navigate(['/quizList']);
      }, (err: Error) => {
        if (err instanceof AccessDeniedError) {
          this.invalidLogin = true;
          return;
        }
        AppUtil.showError(err);
      });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/quizList']);
    }
  }
}
