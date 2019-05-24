import { AppConsts } from './../shared/util/app-consts';
import { AppUtil } from './../shared/util/app-util';
import { JwtModule } from '@auth0/angular-jwt';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const jwtConfig = {
  config: {
    tokenGetter: AppUtil.appTokenGetter,
    whitelistedDomains: [AppConsts.BASE_URL]
  }
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JwtModule.forRoot(jwtConfig)
  ]
})
export class AppJwtModule { }
