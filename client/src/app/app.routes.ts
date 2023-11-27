import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ExploreComponent } from './explore/explore.component';
import { PlannerComponent } from './planner/planner.component';

export const APP_ROUTES: Routes = [
  {path: "signup", component: RegisterComponent},
  {path: "signin", component: LoginComponent},
  {path: "explore", component: ExploreComponent},
  {path: "trail-planner", component: PlannerComponent}
];
