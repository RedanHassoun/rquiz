import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
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
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ShowQuizComponent } from './components/show-quiz/show-quiz.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QuizItemComponent } from './components/quiz-item/quiz-item.component';

@NgModule({
  declarations: [
  ConfirmationDialogComponent,
  CreateQuizComponent,
  ShowQuizComponent,
  QuizItemComponent],
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
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    CreateQuizComponent,
    ShowQuizComponent // TODO: check if this must be in shared
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
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    NgMultiSelectDropDownModule
  ]
})
export class SharedModule {}
