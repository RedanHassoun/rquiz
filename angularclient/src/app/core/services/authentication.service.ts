import { AppUtil } from './../../shared/util/app-util';
import { RegisterRequest } from './../../shared/models/register-message';
import { User } from './../../shared/models/user';
import { LoginMessage } from '../../shared/models/login-message';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppConsts } from '../../shared/util/app-consts';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, distinct } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly jwtHelper = new JwtHelperService();
  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient,
    private jwtService: JwtHelperService,
    private router: Router) {
    const token: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    const user = this.tokenToUser(token);
    this.currentUserSubject.next(user);
  }

  login(credentials: LoginMessage): Observable<HttpResponse<any>> {
    return this.http.post(`${AppConsts.BASE_URL}/login`,
      credentials,
      { observe: 'response' })
      .pipe(catchError(AppUtil.handleError));
  }

  logout() {
    localStorage.removeItem(AppConsts.KEY_USER_TOKEN);
    this.currentUserSubject.next(null);
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

  public persistTokenFromResponse(response: any): void {
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
    const user = this.tokenToUser(authorizationValue);
    this.currentUserSubject.next(user);
  }

  private tokenToUser(token: string): User {
    if (!token) {
      return null;
    }
    try {
      const user: User = JSON.parse(this.jwtHelper.decodeToken(token)[`sub`]);
      return { ...user };
    } catch (ex) {
      console.error('Saved user token is currupted');
      this.logout();
      return null;
    }
  }

  get currentUser() {
    const token: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    if (!token) {
      return null;
    }
    return this.jwtService.decodeToken(token);
  }

  get currentUser$(): Observable<User> {
    return this.currentUserSubject.asObservable().pipe(distinct());
  }

  public async getCurrentUser(): Promise<User> {
    const token: string = localStorage.getItem(AppConsts.KEY_USER_TOKEN);
    if (!token) {
      AppUtil.showErrorMessage('Session expired please login again');
      this.logout();
      return Promise.reject(`Token should not be null`);
    }

    const user: User = this.tokenToUser(token);
    return Promise.resolve(user);
  }
}
