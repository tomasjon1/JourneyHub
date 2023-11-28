import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterLink],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  public isAuthentificated: boolean = false;

  private _authService = inject(AuthService);

  ngOnInit(): void {
    this.userSub = this._authService.user.subscribe((user) => {
      this.isAuthentificated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this._authService.logout();
  }

  showDialog: boolean = false;

  onClick() {
    this.showDialog = !this.showDialog;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.showDialog = false;
  }

  onLogOut() {
    this._authService.logout();
  }
}
