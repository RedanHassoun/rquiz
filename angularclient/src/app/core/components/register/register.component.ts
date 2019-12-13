import { AppUtil } from './../../../shared/util/app-util';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RegisterRequest } from './../../../shared/models/register-message';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormInputComponent } from './../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormInputComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  checkPasswordsValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  constructor(private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) { 
      super();
    }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/quizList']);
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

    this.loading = true;
    this.authService.register(registerRequest).subscribe(response => {
      this.loading = false;
      this.router.navigate(['/login']);
    }, (err) => {
      this.loading = false;
      AppUtil.showError(err);
    });
  }

  isRegisterButtonDisabled(): boolean {
    return this.loading || this.registerForm.invalid;
  }

  passwordsMatch(): boolean {
    if (this.registerForm.errors && this.registerForm.errors['notSame']) {
      return false;
    }
    return true;
  }

  get form() {
    return this.registerForm.controls;
  }
}
