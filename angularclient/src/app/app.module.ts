import { QuizItemComponent } from './feed/components/quiz-item/quiz-item.component';
import { MyAssignedQuizComponent } from './feed/components/my-assigned-quiz/my-assigned-quiz.component';
import { MyQuizListComponent } from './feed/components/my-quiz-list/my-quiz-list.component';
import { QuizListComponent } from './feed/components/quiz-list/quiz-list.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { UserService } from './core/services/user-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { AppJwtModule } from './app-jwt/app-jwt.module';
import { PagingStrategyFactory } from './shared/factories/paging-strategy-factory';
import { PagingStrategyFactoryImpl } from './shared/factories/paging-strategy-factory-impl';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    QuizListComponent,
    MyQuizListComponent, // TODO: check the lazy loading issue
    MyAssignedQuizComponent,
    QuizItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    HttpClientModule,
    AppJwtModule
  ],
  providers: [
    UserService,
    { provide: PagingStrategyFactory, useClass: PagingStrategyFactoryImpl }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
