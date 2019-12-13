import { AbstractControl } from '@angular/forms';

const isInputValidationFailed = (inputControl: AbstractControl): boolean => {
    if (!inputControl) {
        return false;
    }

    return inputControl.invalid && (inputControl.dirty || inputControl.touched);
};

export function InputValidationChecker(): (Function) {
    return (target: Function): void => {
        target.prototype.isInputValidationFailed = (inputControl) => {
            return isInputValidationFailed(inputControl);
        };

        target.prototype.getInputBorderStyle = (inputControl) => {
            return isInputValidationFailed(inputControl) ? '2px solid red' : '';
        };

        target.prototype.setInputBorderStyleInvalid = (isInvalid) => {
            return isInvalid === true ? '2px solid red' : '';
        };
    };
}
