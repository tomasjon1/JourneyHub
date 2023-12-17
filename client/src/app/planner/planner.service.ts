import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LatLng, Marker } from 'leaflet';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  private osrmApiUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';
  apiUrl: string = 'http://localhost:5000';

  private _http = inject(HttpClient);

  public getRoute(waypoints: LatLng[]): Observable<any> {
    if (waypoints.length < 2) {
      throw new Error('At least two waypoints are required for routing.');
    }

    const coordinatesStr = waypoints
      .map((point) => `${point.lng},${point.lat}`)
      .join(';');
    const url = `${this.osrmApiUrl}/walking/${coordinatesStr}?overview=full&geometries=polyline&steps=true`;

    return this._http.get(url);
  }

  public extractCoordsFromMarkers(markers: Marker[]) {
    return markers.map((marker) => marker.getLatLng());
  }

  public saveTrail(form: any): any {
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

    return this._http.post(`${this.apiUrl}/api/Trips`, form, httpOptions);
  }
}
