import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RegisterRequest } from './../../../shared/models/register-message';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/quizList']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
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

    this.loading = true;
    this.authService.register(registerRequest).subscribe(response => {
      console.log(response);
    }, (err) => {
      this.loading = false;
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
