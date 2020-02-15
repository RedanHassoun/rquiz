import { UserItemComponent } from './../users/components/user-item/user-item.component';
import { PeopleListComponent } from './../users/components/people-list/people-list.component';
import { UserAnswersListComponent } from './components/user-answers-list/user-answers-list.component';
import { CreateQuizComponent } from '../feed/components/create-quiz/create-quiz.component';
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
import { ShowQuizComponent } from '../feed/components/show-quiz/show-quiz.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { UserNotificationsListComponent } from './components/user-notifications-list/user-notifications-list.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PageableComponent } from './components/pageable/pageable.component';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [
    PageableComponent,
    ConfirmationDialogComponent,
    CreateQuizComponent,
    ShowQuizComponent,
    EditProfileComponent,
    UserNotificationsListComponent,
    SpinnerComponent,
    UserAnswersListComponent,
    SearchComponent
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
    MatBadgeModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    UserNotificationsListComponent,
    ConfirmationDialogComponent,
    CreateQuizComponent,
    EditProfileComponent,
    UserAnswersListComponent,
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
    MatBadgeModule,
    SpinnerComponent,
    PageableComponent,
    SearchComponent
  ]
})
export class SharedModule { }
