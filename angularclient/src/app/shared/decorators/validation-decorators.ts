import { AppUtil } from './../util/app-util';
import { AbstractControl } from '@angular/forms';

const isInputValidationFailed = (inputControl: AbstractControl): boolean => {
    return inputControl.invalid && (inputControl.dirty || inputControl.touched);
};

export function InputValidationChecker(): Function {
    return (target: Function): void => {
        target.prototype.isInputValidationFailed = (inputControl) => {
            return isInputValidationFailed(inputControl);
        };

        target.prototype.getBorderStyle = (inputControl) => {
            return isInputValidationFailed(inputControl) ? '2px solid red' : '';
        };
    };
}
