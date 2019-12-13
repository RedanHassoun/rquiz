import { AppRoutingModule } from './../routing/app-routing.module';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppJwtModule } from '../app-jwt/app-jwt.module';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { PageableComponent } from './components/pageable/pageable.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormInputComponent } from '../shared/components/form-input/form-input.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    ProfileComponent,
    PageableComponent,
    RegisterComponent,
    FormInputComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppJwtModule,
    AppRoutingModule
  ],
  exports: [
    PageableComponent
  ]
})
export class CoreModule { }
