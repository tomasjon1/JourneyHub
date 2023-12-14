import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LatLng } from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  private apiUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';

  constructor(private http: HttpClient) {}

  public getRoute(waypoints: LatLng[]): Observable<any> {
    if (waypoints.length < 2) {
      throw new Error('At least two waypoints are required for routing.');
    }

    const coordinatesStr = waypoints
      .map((point) => `${point.lng},${point.lat}`)
      .join(';');
    const url = `${this.apiUrl}/walking/${coordinatesStr}?overview=full&geometries=polyline&steps=true`;

    return this.http.get(url);
  }
}
