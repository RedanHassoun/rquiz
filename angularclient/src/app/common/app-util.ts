import { AccessDeniedError } from './access-denied-error';
import { AppError } from './app-error';
import { NotFoundError } from './not-found-error';
import { BadInputError } from './bad-input-error';
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

    public static handleError(error: Response) {
        if (error.status === 400) {
            return throwError(new BadInputError(error.json()));
        }

        if (error.status === 404) {
            return throwError(new NotFoundError());
        }

        if (error.status === 403) {
            return throwError(new AccessDeniedError());
        }

        return throwError(new AppError(error.json()));
    }
}
