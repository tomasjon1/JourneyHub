import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ExploreComponent } from './explore/explore.component';
import { PlannerComponent } from './planner/planner.component';
import { ProfileComponent } from './profile/profile.component';
import { TrailComponent } from './explore/trail/trail.component';

export const APP_ROUTES: Routes = [
  { path: 'signup', component: RegisterComponent, title: 'Sign Up' },
  { path: 'signin', component: LoginComponent, title: 'Sign In' },
  { path: 'explore', component: ExploreComponent, title: 'Explore' },
  { path: 'trail/:id', component: TrailComponent, title: 'Trail Details' },
  {
    path: 'trail-planner',
    component: PlannerComponent,
    title: 'Plan a trail',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'User profile',
  },
];
