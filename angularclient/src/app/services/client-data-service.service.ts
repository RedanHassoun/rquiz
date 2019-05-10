import { Injectable } from '@angular/core';
import { AppConsts } from '../common/app-consts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadInputError } from '../common/bad-input-error';
import { NotFoundError } from '../common/not-found-error';
import { AppError } from '../common/app-error';
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
      .pipe(catchError(this.handleError));
  }

  delete(id: string) {
    const headers = new HttpHeaders();
    // this.createAuthorizationHeader(headers);
    return this.http.delete(this.url + id, { headers: headers })
      .pipe(map((response: string) => JSON.parse(response)))
      .pipe(catchError(this.handleError));
  }

  create(resource) {
    return this.http.post(this.url, resource.json())
    .pipe(catchError(this.handleError));
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return Observable.throw(new BadInputError(error.json()));
    }

    if (error.status === 404) {
      return Observable.throw(new NotFoundError());
    }

    return Observable.throw(new AppError(error.json()));
  }
}
