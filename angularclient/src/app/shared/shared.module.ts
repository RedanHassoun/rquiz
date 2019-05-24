import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUtil } from './util/app-util';
import { AppJwtModule } from '../app-jwt/app-jwt.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppJwtModule
  ],
  exports: [
    AppUtil
  ]
})
export class SharedModule { }
