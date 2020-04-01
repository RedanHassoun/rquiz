import { AppUtil } from './../../shared/util/app-util';
import { AppConsts } from './../../shared/util/app-consts';
import { HttpHeaders } from '@angular/common/http';

export class CoreUtil {
    public static createAuthorizationHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        const authorizationToken: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
        headers = headers.set('Authorization', authorizationToken);
        return headers;
    }

    public static removePrefix(str: string, prefix: string): string {
        if (!AppUtil.hasValue(str)) {
            return null;
        }
        if (!AppUtil.hasValue(prefix) || prefix === '') {
            return str;
        }
        return str.replace(prefix, '');
    }
}
