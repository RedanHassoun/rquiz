import { AccessDeniedError } from './../app-errors/access-denied-error';
import { NotFoundError } from './../app-errors/not-found-error';
import { BadInputError } from './../app-errors/bad-input-error';
import { Observable, Subscription } from 'rxjs';
import { AppConsts } from './app-consts';
import { throwError } from 'rxjs';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';

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

    public static removeById(items: any[], id: string): any[] {
        return _.remove(items, (item) => {
            return item.id !== id;
        });
    }

    public static handleError(error: HttpErrorResponse): Observable<never> {
        const bodyContent: string = error.message;

        if (error.status === 400) {
            return throwError(new BadInputError(bodyContent));
        }

        if (error.status === 404) {
            return throwError(new NotFoundError(bodyContent));
        }

        if (error.status === 403 || error.status === 401) {
            return throwError(new AccessDeniedError(bodyContent));
        }

        return throwError(new Error(bodyContent));
    }

    public static showError(err: Error): void {
        if (err instanceof AccessDeniedError) {
            alert('Access denied!');
            return;
        }
        alert(`${err.message}`);
    }

    public static appTokenGetter() {
        return localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    }

    public static handleNullError(nullField: string) {
        alert(`${nullField} cannot be null`);
    }

    public static releaseSubscriptions(subscriptions: Subscription[]) {
        if (!subscriptions || subscriptions.length === 0) {
            return;
        }

        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    }

    public static showWarningMessage(message: string) {
        alert(message);
    }
}
