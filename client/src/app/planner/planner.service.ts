import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LatLng, Marker, latLng } from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  private osrmApiUrl = 'https://routing.openstreetmap.de/routed-foot/route/v1';
  apiUrl: string = 'https://localhost:5001';

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

  public getTrails(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/Trips`, {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  public getTrail(trailId: string): any {
    return this._http.get(`${this.apiUrl}/api/Trips/${trailId}`);
  }

  public decodePolyline(encoded: string): LatLng[] {
    let points: LatLng[] = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push(latLng(lat / 1e5, lng / 1e5));
    }

    return points;
  }
}
