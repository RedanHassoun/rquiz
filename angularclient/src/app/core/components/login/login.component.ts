import { AccessDeniedError } from './../../../shared/app-errors/access-denied-error';
import { LoginMessage } from '../../../shared/models/login-message';
import { AppUtil } from '../../../shared/util/app-util';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InputValidationChecker } from './../../../shared/decorators/validation-decorators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@InputValidationChecker()
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invalidLogin: boolean;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) { }

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

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }
}
