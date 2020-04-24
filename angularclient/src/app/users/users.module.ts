import { AppRoutingModule } from './../routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { UserItemComponent } from '../shared/components/user-item/user-item.component';

@NgModule({
  declarations: [
    PeopleListComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CoreModule,
    SharedModule
  ], exports: [
    PeopleListComponent
  ]
})
export class UsersModule { }
