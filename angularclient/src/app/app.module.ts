import { AppConsts } from './common/app-consts';
import { UserServiceService } from './services/user-service.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export function appTokenGetter() {
  return localStorage.getItem(AppConsts.KEY_USER_TOKEN);
}

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserFormComponent,
    LoginComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: appTokenGetter,
        throwNoTokenError: true,
        whitelistedDomains: [AppConsts.BASE_URL]
      }
    })
  ],
  providers: [UserServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
