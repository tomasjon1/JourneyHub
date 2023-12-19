import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface UserProfileData {
  Username: string;
  Email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  apiUrl: string = 'http://localhost:5000';

  private readonly _http = inject(HttpClient);

  public getUserData() : Observable<UserProfileData>{
    return this._http.get<UserProfileData>(`${this.apiUrl}/api/Users`);
  }

  constructor() { }
}
