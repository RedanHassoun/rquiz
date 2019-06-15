import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { ProfileComponent } from './../shared/components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppJwtModule } from '../app-jwt/app-jwt.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatButtonModule} from '@angular/material/button'; 
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
  ConfirmationDialogComponent,
  CreateQuizComponent],
  imports: [
    CommonModule,
    AppJwtModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    CreateQuizComponent
  ],
  exports: [
    FormsModule,
    CommonModule,
    InfiniteScrollModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class SharedModule { }