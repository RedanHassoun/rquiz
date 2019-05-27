import { QuizListComponent } from './feed/components/quiz-list/quiz-list.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ProfileComponent } from './shared/components/profile/profile.component';

import { AppConsts } from './shared/util/app-consts';
import { UserServiceService } from './core/services/user-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './core/components/user-list/user-list.component';
import { UserFormComponent } from './core/components/user-form/user-form.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AppJwtModule } from './app-jwt/app-jwt.module';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    QuizListComponent // TODO: check the lazy loading issue
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
