import { AppUtil } from './../common/app-util';
import { LoginMessage } from './../models/login-message';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConsts } from '../common/app-consts';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
              private jwtService: JwtHelperService) {
  }

  login(credentials: LoginMessage): Observable<HttpResponse<any>> {
    return this.http.post(`${AppConsts.BASE_URL}/login`,
                          credentials,
                          { observe: 'response' })
                    .pipe(catchError(AppUtil.handleError));
  }

  logout() {
    localStorage.removeItem(AppConsts.KEY_USER_TOKEN);
  }

  isLoggedIn() {
    const token: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    if (token && token !== 'undefined') {
      return !this.jwtService.isTokenExpired();
    }
    return false;
  }

  get currentUser() {
    const token: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    if (!token) {
      return null;
    }
    return this.jwtService.decodeToken(token);
  }
}
