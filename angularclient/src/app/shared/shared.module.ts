import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppJwtModule } from '../app-jwt/app-jwt.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShowQuizComponent } from './components/show-quiz/show-quiz.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QuizItemComponent } from './components/quiz-item/quiz-item.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    CreateQuizComponent,
    ShowQuizComponent,
    QuizItemComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    AppJwtModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSidenavModule,
    MatBadgeModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    CreateQuizComponent,
    EditProfileComponent,
    ShowQuizComponent // TODO: check if this must be in shared
  ],
  exports: [
    FormsModule,
    CommonModule,
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
    MatTooltipModule,
    NgMultiSelectDropDownModule,
    QuizItemComponent,
    MatBadgeModule
  ]
})
export class SharedModule { }
