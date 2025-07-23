import { Routes } from '@angular/router';

import { About } from './about/about';
import { Addreservations } from './addreservations/addreservations';
import { Reservations } from './reservations/reservations';
import { Updatereservations } from './updatereservations/updatereservations';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'reservations', component: Reservations, canActivate: [AuthGuard] },
  { path: 'addreservations', component: Addreservations, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: Updatereservations, canActivate: [AuthGuard] },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '/reservations', pathMatch: 'full' }
];


