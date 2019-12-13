import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

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
}
