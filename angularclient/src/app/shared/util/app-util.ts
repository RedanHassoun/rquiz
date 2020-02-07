import { TOPIC_USER_UPDATE } from './../../core/common/socket-consts';
import { User } from './../models/user';
import { AppNotificationMessage } from './../../core/common/socket-consts';
import { AccessDeniedError } from './../app-errors/access-denied-error';
import { NotFoundError } from './../app-errors/not-found-error';
import { BadInputError } from './../app-errors/bad-input-error';
import { Observable, Subscription } from 'rxjs';
import { AppConsts } from './app-consts';
import { throwError } from 'rxjs';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { StopLoadingIndicator, StartLoadingIndicator } from '../decorators/spinner-decorators';

export class AppUtil {
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
            setTimeout(() => alert('Access denied!'), 1);
            return;
        }

        if (err.message) {
            setTimeout(() => alert(`${err.message}`), 1);
            return;
        }

        setTimeout(() => alert('Something went wrong...'), 1);
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

    public static showErrorMessage(message: string) {
        alert(message);
    }

    public static getFullException(error: Error): string {
        if (!error) {
            return null;
        }
        return `${error.message}\nStack: ${error.stack}`;
    }

    public static isNotificationForCurrentUserUpdate(message: AppNotificationMessage, currentUser: User): boolean {
        if (!message || !currentUser) {
            return false;
        }
        if (message.topic !== TOPIC_USER_UPDATE) {
            return false;
        }
        const userId = message.content;
        return userId === currentUser.id;
    }

    @StartLoadingIndicator
    public static triggerLoadingIndicator() {
    }

    @StopLoadingIndicator
    public static triggerLoadingIndicatorStop() {
    }
}
