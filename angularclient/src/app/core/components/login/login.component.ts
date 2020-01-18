import { AppNotificationMessage } from './../../model/socket-consts';
import { NotificationService } from './../../services/notification.service';
import { FormInputComponent } from './../../../shared/components/form-input/form-input.component';
import { AccessDeniedError } from './../../../shared/app-errors/access-denied-error';
import { LoginMessage } from '../../../shared/models/login-message';
import { AppUtil } from '../../../shared/util/app-util';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends FormInputComponent implements OnInit {
  loginForm: FormGroup;
  invalidLogin: boolean;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) {
    super();
  }

  async signIn(credentials: LoginMessage) {
    this.authService.login(credentials)
      .subscribe(async (response) => {
        AppUtil.extractAndSaveToken(response);
        const currentUserId: string = (await this.authService.getCurrentUser()).id;
        await this.goToMainPage(currentUserId);
      }, (err: Error) => {
        if (err instanceof AccessDeniedError) {
          this.invalidLogin = true;
          return;
        }
        AppUtil.showError(err);
      });
  }

  async ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const currentUserId: string = (await this.authService.getCurrentUser()).id;
      await this.goToMainPage(currentUserId);
      return;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  private async goToMainPage(userId: string) {
    this.router.navigate(['/quizList']);
  }

  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }
}
