import { Component } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RegisterComponent, NavbarComponent, RouterModule],
})
export class AppComponent {}
