import { Injectable } from '@angular/core';
import { ClientDataServiceService } from './client-data-service.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../common/app-consts';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService extends ClientDataServiceService {

  constructor(http: HttpClient) {
    super(AppConsts.BASE_URL, http);
  }

}
