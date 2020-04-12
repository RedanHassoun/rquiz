import { AppMenuService } from './../../../shared/services/app-menu.service';
import { FormInputComponent } from './../../../shared/components/form-input/form-input.component';
import { AccessDeniedError } from './../../../shared/app-errors/access-denied-error';
import { LoginMessage } from '../../../shared/models/login-message';
import { AppUtil } from '../../../shared/util/app-util';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
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
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private appMenuService: AppMenuService) {
    super();
  }

  async signIn(credentials: LoginMessage) {
    this.authService.login(credentials)
      .subscribe(async (response) => {
        this.authService.persistTokenFromResponse(response);
        const currentUserId: string = (await this.authService.getCurrentUser()).id;
        this.appMenuService.enterMainPage(currentUserId);
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
      this.appMenuService.enterMainPage(currentUserId);
      return;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }
}
