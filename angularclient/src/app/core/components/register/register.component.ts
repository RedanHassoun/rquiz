import { AppUtil } from './../../../shared/util/app-util';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RegisterRequest } from './../../../shared/models/register-message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormInputComponent } from './../../../shared/components/form-input/form-input.component';
import { ROUTE_NAMES } from 'src/app/shared/util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormInputComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      const targetRoute = `/${ROUTE_NAMES.QUIZ_LIST.name}`;
      this.router.navigate([targetRoute]);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswordsValidator });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const registerRequest = new RegisterRequest();
    registerRequest.username = this.registerForm.value.username;
    registerRequest.password = this.registerForm.value.password;
    registerRequest.email = this.registerForm.value.email;

    AppUtil.triggerLoadingIndicator();
    this.authService.register(registerRequest).subscribe(response => {
      AppUtil.triggerLoadingIndicatorStop();
      const targetRoute = `/${ROUTE_NAMES.LOGIN.name}`;
      this.router.navigate([targetRoute]);
    }, (err) => {
      AppUtil.triggerLoadingIndicatorStop();
      AppUtil.showError(err);
    });
  }

  cancelRegister(): void {
    const targetRoute = `/${ROUTE_NAMES.LOGIN.name}`;
    this.router.navigate([targetRoute]);
  }

  isRegisterButtonDisabled(): boolean {
    return this.registerForm.invalid;
  }

  get form() {
    return this.registerForm.controls;
  }
}
