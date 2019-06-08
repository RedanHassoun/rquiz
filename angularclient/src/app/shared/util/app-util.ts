import { User } from './../models/user';
import { AppError } from './../app-errors/app-error';
import { AccessDeniedError } from './../app-errors/access-denied-error';
import { NotFoundError } from './../app-errors/not-found-error';
import { BadInputError } from './../app-errors/bad-input-error';
import { Observable } from 'rxjs';
import { AppConsts } from './app-consts';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

export class AppUtil {
    public static extractAndSaveToken(response: any): void {
        if (!response[`status`] || response[`status`] !== 200) {
            throw new Error('Response status should be 200');
        }

        if (!response[`headers`]) {
            throw new Error('No headers found in response');
        }

        const headers = response[`headers`];

        const authorizationValue: string = headers.get(`Authorization`);

        if (!authorizationValue) {
            throw new Error('Cannot find token inside headers');
        }

        localStorage.setItem(AppConsts.KEY_USER_TOKEN, authorizationValue);
    }

    public static handleError(error: Response): Observable<never> {
        if (error.status === 400) {
            return throwError(new BadInputError(error));
        }

        if (error.status === 404) {
            return throwError(new NotFoundError());
        }

        if (error.status === 403) {
            return throwError(new AccessDeniedError());
        }

        return throwError(new AppError(error));
    }

    public static showError(err: AppError): void {
        if (err instanceof AccessDeniedError) {
            alert('Access denied!');
            return;
        }
        alert('Something went wrong...');
    }

    public static appTokenGetter() {
        return localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    }

    public static handleNullError(nullField: string) {
        alert(`${nullField} cannot be null`);
    }
}
