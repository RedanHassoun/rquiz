import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  template: ``
})
export class FormInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public isInputValidationFailed(inputControl: AbstractControl): boolean {
    if (!inputControl) {
      return false;
    }

    return inputControl.invalid && (inputControl.dirty || inputControl.touched);
  }

  public getInputBorderStyle(inputControl) {
    return this.isInputValidationFailed(inputControl) ? '2px solid red' : '';
  }

  public setInputBorderStyleInvalid(isInvalid) {
    return isInvalid === true ? '2px solid red' : '';
  }

  public checkPasswordsValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  public passwordsMatch(form: FormGroup): boolean {
    if (!form) {
      return false;
    }

    if (form.errors && form.errors['notSame']) {
      return false;
    }

    return true;
  }
}
