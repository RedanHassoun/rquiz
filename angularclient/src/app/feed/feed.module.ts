import { CoreModule } from './../core/core.module';
import { AppJwtModule } from './../app-jwt/app-jwt.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { ShowQuizComponent } from './components/show-quiz/show-quiz.component';
import { MyQuizListComponent } from './components/my-quiz-list/my-quiz-list.component';

@NgModule({
  declarations: [
    QuizListComponent,
    ShowQuizComponent,
    MyQuizListComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    AppJwtModule
  ]
})
export class FeedModule { }
