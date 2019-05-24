
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
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AppUtil } from './shared/util/app-util';
import { AppJwtModule } from './app-jwt/app-jwt.module';

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
    AppJwtModule
  ],
  providers: [UserServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
