import { QuizItemComponent } from './components/quiz-item/quiz-item.component';
import { CoreModule } from './../core/core.module';
import { AppJwtModule } from './../app-jwt/app-jwt.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    // TODO: the quiz components declarations should be here
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    AppJwtModule
  ],
  exports: [
  ]
})
export class FeedModule { }
