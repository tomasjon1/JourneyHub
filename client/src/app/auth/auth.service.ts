import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  apiUrl: string = 'https://localhost:44368'

  private readonly _http = inject(HttpClient);

  public register(form: any): any {
    return this._http.post(`${this.apiUrl}/api/Auth/Register`, form);
  }

  public login(form: any): any {
    return this._http.post(`${this.apiUrl}/api/Auth/Login`, form)
  }
}