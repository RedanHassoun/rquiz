import { MyQuizListComponent } from './../feed/components/my-quiz-list/my-quiz-list.component';
import { QuizListComponent } from './../feed/components/quiz-list/quiz-list.component';
import { ProfileComponent } from '../shared/components/profile/profile.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { LoginComponent } from '../core/components/login/login.component';
import { UserFormComponent } from '../core/components/user-form/user-form.component';
import { UserListComponent } from '../core/components/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'quizList', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'quizList', component: QuizListComponent, canActivate: [AuthGuard] },
  { path: 'myquizlist', component: MyQuizListComponent, canActivate: [AuthGuard] },
  { path: 'users/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'adduser', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
