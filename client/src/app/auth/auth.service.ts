import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<any>(null);
  private tokenExpirationTimer: any;

  apiUrl: string = 'http://localhost:5000';

  private readonly _http = inject(HttpClient);

  private handleAuth(
    name: string,
    email: string,
    token: string,
    expiration: Date
  ) {
    const user = new User(name, email, token, expiration);
    this.user.next(user);
    this.autoLogout(new Date(expiration).getTime());
    localStorage.setItem('userData', JSON.stringify(user));
  }

  public register(form: any): any {
    return this._http.post(`${this.apiUrl}/api/Auth/Register`, form).pipe(
      tap((resData: any) => {
        this.handleAuth(
          resData.name,
          resData.email,
          resData.token,
          resData.expiration
        );
      })
    );
  }

  login(form: any) {
    return this._http.post(`${this.apiUrl}/api/Auth/Login`, form).pipe(
      tap((resData: any) => {
        this.handleAuth(
          resData.name,
          resData.email,
          resData.token,
          resData.expiration
        );
      })
    );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {
      name: string;
      email: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.name,
      userData.email,
      userData._token,
      userData._tokenExpirationDate
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
      console.log(expirationDuration);
    }
  }
}
