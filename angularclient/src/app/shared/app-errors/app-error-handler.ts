import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
    private msg: string = 'An unexpected error has ocurred.'
    handleError(error: any): void {
        console.log(this.msg + '. error: ' + error)
        alert(this.msg)
    }
}