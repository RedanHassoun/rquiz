import { Injectable } from '@angular/core';
import { ClientDataServiceService } from '../../shared/services/client-data-service.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../../shared/util/app-consts';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ClientDataServiceService {

  constructor(http: HttpClient) {
    super(`${AppConsts.BASE_URL}/api/v1/users/`, http);
  }

}
