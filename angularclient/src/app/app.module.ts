import { MyQuizListComponent } from './feed/components/my-quiz-list/my-quiz-list.component';
import { QuizListComponent } from './feed/components/quiz-list/quiz-list.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { UserServiceService } from './core/services/user-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AppJwtModule } from './app-jwt/app-jwt.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    QuizListComponent, // TODO: check the lazy loading issue
    MyQuizListComponent
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
    UserServiceService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
