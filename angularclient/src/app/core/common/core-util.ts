import { AppConsts } from './../../shared/util/app-consts';
import { HttpHeaders } from '@angular/common/http';

export class CoreUtil {
    public static createAuthorizationHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        const authorizationToken: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
        headers = headers.set('Authorization', authorizationToken);
        return headers;
    }

    public static hasValue(obj: any): boolean {
        if ((typeof (obj) !== 'undefined') && obj !== null) {
            return true;
        }
        return false;
    }

    public static removePrefix(str: string, prefix: string): string {
        if (!CoreUtil.hasValue(str)) {
            return null;
        }
        if (!CoreUtil.hasValue(prefix) || prefix === '') {
            return str;
        }
        return str.replace(prefix, '');
    }
}
