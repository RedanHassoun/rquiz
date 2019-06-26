import { AppJwtModule } from './../app-jwt/app-jwt.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { ShowQuizComponent } from './components/show-quiz/show-quiz.component';
@NgModule({
  declarations: [
    QuizListComponent,
    ShowQuizComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppJwtModule
  ]
})
export class FeedModule { }
