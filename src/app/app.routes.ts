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

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'exercises', component: ExercisesComponent },
      { path: 'routines', component: RoutinesComponent },
      { 
        path: 'profile', 
        component: ProfileComponent,
        children: [
          { path: 'myProfile', component: ProfileComponent}
      ] },
    ],
  },
  { path: 'info', component: InfoComponent },
  { path: '**', component: Error404Component },
];