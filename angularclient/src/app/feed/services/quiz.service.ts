import { AppUtil } from './../../shared/util/app-util';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from './../../shared/util/app-consts';
import { ClientDataServiceService } from './../../shared/services/client-data-service.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizService extends ClientDataServiceService {
  public static readonly PAGE_SIZE = 5;
  constructor(public http: HttpClient) {
    super(`${AppConsts.BASE_URL}/quiz/`, http);
  }
}
