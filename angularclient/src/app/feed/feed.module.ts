import { ShowQuizComponent } from './components/show-quiz/show-quiz.component';
import { MyAssignedQuizComponent } from './components/my-assigned-quiz/my-assigned-quiz.component';
import { MyQuizListComponent } from './components/my-quiz-list/my-quiz-list.component';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { QuizItemComponent } from './components/quiz-item/quiz-item.component';
import { CoreModule } from './../core/core.module';
import { AppJwtModule } from './../app-jwt/app-jwt.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuizAssignmentComponent } from './components/quiz-assignment/quiz-assignment.component';

@NgModule({
  declarations: [
    QuizListComponent,
    MyQuizListComponent,
    MyAssignedQuizComponent,
    QuizItemComponent,
    ShowQuizComponent,
    QuizAssignmentComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    AppJwtModule
  ],
  entryComponents: [
    ShowQuizComponent
  ],
  exports: [
  ]
})
export class FeedModule { }
