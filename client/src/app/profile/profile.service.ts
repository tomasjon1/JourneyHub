import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiUrl: string = 'https://localhost:5001';

  private readonly _http = inject(HttpClient);

  public getUserProfile(): any {
    const userData: {
      name: string;
      email: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData!._token}`,
      }),
    };

    return this._http.get(`${this.apiUrl}/api/Users`, httpOptions);
  }

  public updateUserProfile(formData: any): any {
    const userData: {
      name: string;
      email: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData!._token}`,
      }),
    };

    return this._http.put(`${this.apiUrl}/api/Users`, formData, httpOptions);
  }

  public deleteUser(): any {
    const userData: {
      name: string;
      email: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData!._token}`,
      }),
    };

    return this._http.delete(`${this.apiUrl}/api/Users`, httpOptions);
  }

  public verifyPassword(password: string): any {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!userData) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData._token}`,
      }),
    };

    return this._http.post(
      `${this.apiUrl}/api/Users/verify-password`,
      { password },
      httpOptions
    );
  }
}
