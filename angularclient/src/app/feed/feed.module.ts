import { AppJwtModule } from './../app-jwt/app-jwt.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';

@NgModule({
  declarations: [
    QuizListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppJwtModule
  ]
})
export class FeedModule { }
