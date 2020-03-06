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
    NotFoundComponent
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
