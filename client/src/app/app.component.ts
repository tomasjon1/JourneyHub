import { Component, OnInit, inject } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RegisterComponent, NavbarComponent, RouterModule],
})
export class AppComponent implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _title = inject(Title);

  ngOnInit() {
    this._authService.autoLogin();

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child: ActivatedRoute | null = this._route.firstChild;
          let title = child && child.snapshot.data['title'];
          if (title) {
            return title;
          }
        })
      )
      .subscribe((title) => {
        if (title) {
          this._title.setTitle(title);
        }
      });
  }
}
