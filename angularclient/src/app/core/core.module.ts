import { AppConsts } from './../shared/util/app-consts';
import { AppUtil } from './../shared/util/app-util';
import { JwtModule } from '@auth0/angular-jwt';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppJwtModule } from '../app-jwt/app-jwt.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AppJwtModule
  ]
})
export class CoreModule { }
