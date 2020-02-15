import { AppRoutingModule } from './../routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { UserItemComponent } from './components/user-item/user-item.component';

@NgModule({
  declarations: [
    PeopleListComponent,
    UserItemComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CoreModule,
    SharedModule
  ], exports: [
    UserItemComponent,
    PeopleListComponent
  ]
})
export class UsersModule { }
