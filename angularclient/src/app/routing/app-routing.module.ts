import { AuthGuard } from '../shared/guards/auth.guard';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { LoginComponent } from '../core/components/login/login.component';
import { UserFormComponent } from '../core/components/user-form/user-form.component';
import { UserListComponent } from '../core/components/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'adduser', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
