import { Injectable } from '@angular/core';
import { Map } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapInstance!: Map;

  setMap(map: Map): void {
    this.mapInstance = map;
  }

  getMap(): Map | null {
    return this.mapInstance;
  }
}
