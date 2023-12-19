import { Injectable } from '@angular/core';
import { Map } from 'leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapInstance!: Map;
  private screenshoter!: SimpleMapScreenshoter;

  setMap(map: Map): void {
    this.mapInstance = map;
    this.screenshoter = new SimpleMapScreenshoter().addTo(map);
  }

  takeScreenshot(): Observable<File> {
    let overridedPluginOptions = {};

    return new Observable<File>((observer) => {
      this.screenshoter
        .takeScreen('blob', overridedPluginOptions)
        .then((blob) => {
          const screenshotFile = new File(
            [blob as BlobPart],
            `map-screenshot-${new Date().toISOString()}.png`,
            { type: 'image/png' }
          );
          observer.next(screenshotFile);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error taking screenshot:', error);
          observer.error(error);
        });
    });
  }

  getMap(): Map | null {
    return this.mapInstance;
  }
}
