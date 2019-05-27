import { HttpClient } from '@angular/common/http';
import { AppConsts } from './../../shared/util/app-consts';
import { ClientDataServiceService } from './../../shared/services/client-data-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizService extends ClientDataServiceService {
  constructor(http: HttpClient) {
    super(`${AppConsts.BASE_URL}/quiz/`, http);
  }
}
