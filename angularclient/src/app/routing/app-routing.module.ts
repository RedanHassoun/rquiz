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
import { UserFormComponent } from '../core/components/user-form/user-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppConsts } from '../shared/util/app-consts';

const routes: Routes = [
  { path: '', redirectTo: 'quizList', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'quizList', component: QuizListComponent, canActivate: [AuthGuard] },
  { path:  AppConsts.MY_QUIZ_LIST, component: MyQuizListComponent, canActivate: [AuthGuard] },
  { path:  AppConsts.MY_ASSIGNED_QUIZ_LIST, component: MyAssignedQuizComponent, canActivate: [AuthGuard] },
  { path: `${AppConsts.PEOPLE_LIST}/:id`, component: ProfileComponent, canActivate: [AuthGuard] },
  { path:  AppConsts.PEOPLE_LIST, component: PeopleListComponent, canActivate: [AuthGuard] },
  { path: 'adduser', component: UserFormComponent, canActivate: [AuthGuard] },
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
