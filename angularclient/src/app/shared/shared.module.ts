import { ProfileComponent } from './../shared/components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUtil } from './util/app-util';
import { AppJwtModule } from '../app-jwt/app-jwt.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AppJwtModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    CommonModule
  ]
})
export class SharedModule { }
