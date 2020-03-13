import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppJwtModule } from '../app-jwt/app-jwt.module';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { FormInputComponent } from '../shared/components/form-input/form-input.component';

@NgModule({
  declarations: [
    ProfileComponent,
    RegisterComponent,
    FormInputComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppJwtModule
  ]
})
export class CoreModule { }
