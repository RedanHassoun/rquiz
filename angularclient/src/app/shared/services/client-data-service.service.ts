import { CoreUtil } from './../../core/common/core-util';
import { AppUtil } from '../util/app-util';
import { AppConsts } from '../util/app-consts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

export class ClientDataServiceService {
  constructor(public url: string, public http: HttpClient) {
  }
  // TODO: take headers from interceptor
  getAll() {
    return this.http.get(`${this.url}all`, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  delete(id: string) {
    return this.http.delete(this.url + id, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(map((response: string) => JSON.parse(response)))
      .pipe(catchError(AppUtil.handleError));
  }

  create(resource) {
    return this.http.post(this.url, resource, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  update(id: string, resource: any) {
    return this.http.put(`${this.url}id`, resource, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  get(id: string) {
    return this.http.get(this.url + id, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  getAllByParameter(filterParamMap: Map<string, string>, page: number, size: number) {
    let url = `${this.url}all`;
    const hasFilterParameters: boolean = filterParamMap && filterParamMap.size > 0;

    if (hasFilterParameters) {
      let firstIteration = true;

      filterParamMap.forEach((value: string, key: string) => {
        if (firstIteration) {
          url += `?${key}=${value}`;
          firstIteration = false;

        } else {
          url += `&${key}=${value}`;
        }
      });
    }

    if (page != null && typeof page !== undefined) {
      if (hasFilterParameters) {
        url += '&';
      } else {
        url += '?';
      }

      url += `page=${page}&size=${size}`;
    }

    return this.http.get(url, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  getAllByCustomUrl(resourceUrl: string, page: number, size: number) {
    resourceUrl = this.url + resourceUrl;
    if (page != null && typeof page !== undefined) {
      resourceUrl += `?page=${page}&size=${size}`;
    }

    return this.http.get(resourceUrl, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }
}
