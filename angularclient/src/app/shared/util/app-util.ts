import { BaseModel } from './../models/base-model';
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
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export class AppUtil {
    public static removeById(items: any[], id: string): void {
        if (!items || !id) {
            return;
        }

        let indexOfItem = -1;
        items.forEach((item, i) => {
            if (item.id === id) {
                indexOfItem = i;
            }
        });
        if (indexOfItem > -1) {
            items.splice(indexOfItem, 1);
        }
    }

    public static handleError(errorResponse: HttpErrorResponse): Observable<never> {
        const bodyContent: string = errorResponse.error.message;

        if (errorResponse.status === 400) {
            return throwError(new BadInputError(bodyContent));
        }

        if (errorResponse.status === 404) {
            return throwError(new NotFoundError(bodyContent));
        }

        if (errorResponse.status === 403 || errorResponse.status === 401) {
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

    public static getTimeAgo(obj: BaseModel): string {
        if (!obj || !obj.createdAt) {
            return null;
        }

        const createdDate = new Date(obj.createdAt);
        return timeAgo.format(createdDate.getTime());
    }
}
