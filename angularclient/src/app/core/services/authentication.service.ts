import { RegisterRequest } from './../../shared/models/register-message';
import { User } from './../../shared/models/user';
import { AppUtil } from '../../shared/util/app-util';
import { LoginMessage } from '../../shared/models/login-message';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConsts } from '../../shared/util/app-consts';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
    private jwtService: JwtHelperService,
    private router: Router) {
  }

  login(credentials: LoginMessage): Observable<HttpResponse<any>> {
    return this.http.post(`${AppConsts.BASE_URL}/login`,
      credentials,
      { observe: 'response' })
      .pipe(catchError(AppUtil.handleError));
  }

  logout() {
    localStorage.removeItem(AppConsts.KEY_USER_TOKEN);
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  register(register: RegisterRequest): Observable<HttpResponse<any>> {
    if (!register) {
      throw new Error('Cannot register, request is not defined');
    }

    return this.http.post(`${AppConsts.BASE_URL}/sign-up`,
      register,
      { observe: 'response' })
      .pipe(catchError(AppUtil.handleError));
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

  public async getCurrentUser(): Promise<User> {
    const jwtHelper = new JwtHelperService();

    const token: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    if (!token) {
      throw new Error(`Token should not be null`);
    }

    const user: User = JSON.parse(jwtHelper.decodeToken(token)[`sub`]);
    if (!user) {
      throw new Error(`User cannot be null`);
    }

    return Promise.resolve(user);
  }
}
