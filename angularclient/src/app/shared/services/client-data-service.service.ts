import { AppUtil } from '../util/app-util';
import { Injectable } from '@angular/core';
import { AppConsts } from '../util/app-consts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientDataServiceService {
  constructor(private url: string, private http: HttpClient) {
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('x-auth', localStorage.getItem(AppConsts.KEY_USER_TOKEN));
  }

  getAll() {
    const headers = new HttpHeaders();
    // this.createAuthorizationHeader(headers);
    return this.http.get(this.url, { headers: headers })
      .pipe(map( (response: string) => JSON.parse(response)))
      .pipe(catchError(AppUtil.handleError));
  }

  delete(id: string) {
    const headers = new HttpHeaders();
    // this.createAuthorizationHeader(headers);
    return this.http.delete(this.url + id, { headers: headers })
      .pipe(map((response: string) => JSON.parse(response)))
      .pipe(catchError(AppUtil.handleError));
  }

  create(resource) {
    return this.http.post(this.url, resource.json())
    .pipe(catchError(AppUtil.handleError));
  }
}
