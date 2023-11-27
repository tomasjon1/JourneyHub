import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: './navbar.component.html',
  imports: [RouterLink],
})
export class NavbarComponent {}
