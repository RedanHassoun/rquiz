import { AppError } from './../app-errors/app-error';
import { AccessDeniedError } from './../app-errors/access-denied-error';
import { NotFoundError } from './../app-errors/not-found-error';
import { BadInputError } from './../app-errors/bad-input-error';
import { Observable } from 'rxjs';
import { AppConsts } from './app-consts';
import { throwError } from 'rxjs';

export class AppUtil {
    public static extractAndSaveToken(response: any): void {
        if (!response[`status`] || response[`status`] !== 200) {
            throw new Error('Response status should be 200');
        }

        if (!response[`headers`]) {
            throw new Error('No headers found in response');
        }

        const headers = response[`headers`];

        let authorizationValue: string = headers.get(`Authorization`);

        if (!authorizationValue) {
            throw new Error('Cannot find token inside headers');
        }
        authorizationValue = authorizationValue.split(' ')[1]; // remove the 'Bearer' section
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
}
