import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService) {
  }
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    if (this.authService.isLoggedIn()){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

}
