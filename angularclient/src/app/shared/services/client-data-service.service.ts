import { User } from './../models/user';
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
  constructor(public url: string, public http: HttpClient) {
  }

  public createAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders(); // TODO: take from 'jwt' interceptor
    const authorizationToken: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    headers = headers.set('Authorization', authorizationToken);
    return headers;
  }

  getAll() {
    return this.http.get(`${this.url}all`, { headers: this.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  delete(id: string) {
    return this.http.delete(this.url + id, { headers: this.createAuthorizationHeader() })
      .pipe(map((response: string) => JSON.parse(response)))
      .pipe(catchError(AppUtil.handleError));
  }

  create(resource) {
    return this.http.post(this.url, resource.json())
      .pipe(catchError(AppUtil.handleError));
  }

  get(id: string) {
    return this.http.get(this.url + id, { headers: this.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }
}
