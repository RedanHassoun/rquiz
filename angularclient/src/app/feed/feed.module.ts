import { CoreModule } from './../core/core.module';
import { AppJwtModule } from './../app-jwt/app-jwt.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    AppJwtModule
  ]
})
export class FeedModule { }
