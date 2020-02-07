import { User } from './../../shared/models/user';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ClientDataService } from '../../shared/services/client-data.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../../shared/util/app-consts';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ClientDataService {
  constructor(http: HttpClient, private authService: AuthenticationService) {
    super(`${AppConsts.BASE_URL}/api/v1/users/`, http);
  }

  public getUserDetails(userId: string, defaultValue: User = null): Observable<User> {
    return super.get(userId)
      .pipe(map(fetchResult => fetchResult as User))
      .pipe(catchError((err: Error) => {
        return of(defaultValue);
      }));
  }
}
