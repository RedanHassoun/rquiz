import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../common/app-consts';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
              private jwtService: JwtHelperService) {
  }

  login(credentials) {
    return this.http.post(`${AppConsts.BASE_URL}/login`, credentials);
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
