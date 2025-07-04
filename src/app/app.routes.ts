import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Error404Component } from './pages/error404/error404.component';
import { InfoComponent } from './pages/info/info.component';
import { OverviewComponent } from './pages/dashboard/pages/overview/overview.component';
import { CalendarComponent } from './pages/dashboard/pages/calendar/calendar.component';
import { ExercisesComponent } from './pages/dashboard/pages/exercises/exercises.component';
import { RoutinesComponent } from './pages/dashboard/pages/routines/routines.component';
import { ProfileComponent } from './pages/dashboard/pages/profile/profile.component';
import { RoutineFormComponent } from './pages/dashboard/pages/routine-form/routine-form.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { loginGuard } from './guards/login.guard';
import { TerminosComponent } from './pages/terminos/terminos.component';
import { PrivacidadComponent } from './pages/privacidad/privacidad.component';
import { ResponsabilidadComponent } from './pages/responsabilidad/responsabilidad.component';
import { PasswordResetRequestComponent } from './pages/password-reset-request/password-reset-request.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [loginGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'exercises', component: ExercisesComponent },
      { path: 'routines', component: RoutinesComponent },
      { path: 'routines/edit/:id', component: RoutineFormComponent },
      { path: 'routines/new', component: RoutineFormComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: 'info', component: InfoComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'password-reset-request', component: PasswordResetRequestComponent },
  { path: 'password-reset-request/:reset-token', component: PasswordResetRequestComponent },
  { path: 'info', component: InfoComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'responsabilidad', component: ResponsabilidadComponent },
  { path: '**', component: Error404Component },
];
