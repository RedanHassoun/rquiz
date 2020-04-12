import { FeedModule } from './../feed/feed.module';
import { UsersModule } from './../users/users.module';
import { PeopleListComponent } from './../users/components/people-list/people-list.component';
import { RegisterComponent } from './../core/components/register/register.component';
import { MyAssignedQuizComponent } from './../feed/components/my-assigned-quiz/my-assigned-quiz.component';
import { MyQuizListComponent } from './../feed/components/my-quiz-list/my-quiz-list.component';
import { QuizListComponent } from './../feed/components/quiz-list/quiz-list.component';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { NotFoundComponent } from '../core/components/not-found/not-found.component';
import { LoginComponent } from '../core/components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ROUTE_NAMES } from '../shared/util';

const routes: Routes = [
  { path: '', redirectTo: ROUTE_NAMES.QUIZ_LIST.name, pathMatch: 'full' },
  { path: ROUTE_NAMES.LOGIN.name, component: LoginComponent },
  { path: ROUTE_NAMES.REGISTER.name, component: RegisterComponent },
  { path: ROUTE_NAMES.QUIZ_LIST.name, component: QuizListComponent, canActivate: [AuthGuard] },
  { path: ROUTE_NAMES.MY_QUIZ_LIST.name, component: MyQuizListComponent, canActivate: [AuthGuard] },
  { path: ROUTE_NAMES.MY_ASSIGNED_QUIZ_LIST.name, component: MyAssignedQuizComponent, canActivate: [AuthGuard] },
  { path: ROUTE_NAMES.PROFILE.name, component: ProfileComponent, canActivate: [AuthGuard] },
  { path: ROUTE_NAMES.PEOPLE_LIST.name, component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
  ],
  imports: [
    UsersModule,
    FeedModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
