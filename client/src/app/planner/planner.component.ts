import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import * as FileSaver from 'file-saver';
import {
  LatLng,
  MapOptions,
  Marker,
  latLng,
  polyline,
  tileLayer,
  Map,
  Symbol,
  Polyline,
  Icon,
} from 'leaflet';
import { PlannerOptionsComponent } from './planner-options/planner-options.component';
import { PlannerService } from './planner.service';
import 'leaflet-polylinedecorator';
import { PolylineDecorator } from 'leaflet';
import { PlannerModalComponent } from './planner-options/planner-modal/planner-modal.component';
import { MapService } from './map.service';

@Component({
  standalone: true,
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  imports: [LeafletModule, PlannerOptionsComponent, PlannerModalComponent],
})
export class PlannerComponent implements OnInit {
  mapOptions!: MapOptions;
  map!: Map;
  waypoints: LatLng[] = [];
  markers: Marker[] = [];
  routeLayer: any;
  distance: number = 0;
  duration: number = 0;
  routeCoordinates: LatLng[] = [];
  isAddMode: boolean = true;
  simpleMapScreenshoter!: SimpleMapScreenshoter;

  private arrowLayer: any;

  private _plannerService = inject(PlannerService);
  private cdRef = inject(ChangeDetectorRef);
  private _mapService = inject(MapService);

  ngOnInit(): void {
    this.initializeMapOptions();
    this.requestLocation();
  }

  toggleMode(isAddMode: boolean): void {
    this.isAddMode = isAddMode;
    console.log(isAddMode);
  }

  private initializeMapOptions(): void {
    this.mapOptions = {
      zoom: 12,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '...',
          zIndex: 10,
        }),
      ],
      center: latLng(24.723079, 25.2333521),
    };
  }

  onMapReady(map: Map): void {
    this._mapService.setMap(map);
    this.map = map;
    this.map.on('click', this.onMapClick.bind(this));
    this.map.on('zoomend', () => this.updatePolylineDecorator());
    this.markers.forEach((marker) => {
      marker.on('click', (e) => this.onMarkerClick(e, marker));
    });

    this.updatePolylineDecorator();
  }

  startIcon = new Icon({
    iconUrl: '../assets/starting-point-icon.svg',
    iconSize: [20, 20],
  });

  midIcon = new Icon({
    iconUrl: '../assets/mid-point-icon.svg',
    iconSize: [20, 20],
  });

  endIcon = new Icon({
    iconUrl: '../assets/end-point-icon.svg',
    iconSize: [20, 20],
  });

  private updatePolylineDecorator(): void {
    const currentZoom = this.map.getZoom();

    if (currentZoom >= 13) {
      if (!this.arrowLayer && this.routeLayer) {
        this.arrowLayer = new PolylineDecorator(this.routeLayer, {
          patterns: [
            {
              repeat: '300',
              offset: 40,
              symbol: Symbol.arrowHead({
                pixelSize: 15,
                pathOptions: {
                  color: '#0084A0',
                  fillOpacity: 1,
                  weight: 0,
                },
              }),
            },
          ],
        }).addTo(this.map);
      }
    } else {
      if (this.arrowLayer) {
        this.map.removeLayer(this.arrowLayer);
        this.arrowLayer = null;
      }
    }
  }

  clearAllPoints(): void {
    this.waypoints = [];
    this.distance = 0;
    this.duration = 0;
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }
    if (this.arrowLayer) {
      this.map.removeLayer(this.arrowLayer);
    }
    // Trigger any necessary change detection
    this.cdRef.detectChanges();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        console.log(longitude, latitude);
      });
    } else {
      console.log('No support for geolocation');
    }
  }

  private onMapClick(e: any): void {
    if (this.isAddMode) {
      this.addPoint(e);
    }
  }
  private onMarkerClick(e: any, clickedMarker: Marker): void {
    if (!this.isAddMode) {
      this.removePoint(clickedMarker);
    }
  }

  private removePoint(clickedMarker: Marker): void {
    const index = this.markers.indexOf(clickedMarker);

    if (index > -1) {
      this.map.removeLayer(clickedMarker);
      this.markers.splice(index, 1);
      this.waypoints.splice(index, 1);

      if (index === 0 && this.markers.length > 0) {
        this.markers[0].setIcon(this.startIcon);
      }

      this.updateRoute();
    }
  }

  private addPoint(e: any): void {
    const newPoint = latLng(e.latlng.lat, e.latlng.lng);
    this.waypoints.push(newPoint);

    let iconToUse = this.waypoints.length === 1 ? this.startIcon : this.endIcon;

    const newMarker = new Marker(newPoint, {
      icon: iconToUse,
      draggable: true,
    }).addTo(this.map);

    newMarker.on('dragend', () => this.onMarkerDragEnd(newMarker));
    this.markers.push(newMarker);

    newMarker.on('click', () => {
      if (!this.isAddMode) {
        this.removePoint(newMarker);
        this.updateRoute();
      }
    });

    if (this.waypoints.length > 1) {
      this.updateRoute();
    }
  }

  private onMarkerDragEnd(movedMarker: Marker): void {
    const index = this.markers.indexOf(movedMarker);
    this.waypoints[index] = movedMarker.getLatLng();

    this.updateRoute();
  }

  private requestLocation(): void {
    const storedCoords = localStorage.getItem('mapCoords');
    if (storedCoords) {
      const coords = JSON.parse(storedCoords);
      this.setMapCenter(latLng(coords.lat, coords.lng));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = latLng(
            position.coords.latitude,
            position.coords.longitude
          );
          localStorage.setItem('mapCoords', JSON.stringify(coords));

          this.setMapCenter(coords);
        },
        () => {
          console.log('Location access denied by user');
          this.setMapCenter(latLng(0, 0));
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      this.setMapCenter(latLng(0, 0));
    }
  }

  private setMapCenter(coords: LatLng): void {
    this.mapOptions.center = coords;

    if (this.map) {
      this.map.setView(coords, this.map.getZoom());
    }
  }

  private updateRoute(): void {
    console.log(this.waypoints);
    if (this.waypoints.length < 2) {
      this.map.removeLayer(this.routeLayer);
      this.map.removeLayer(this.arrowLayer);
      this.distance = 0;
      this.duration = 0;

      return;
    }

    this._plannerService.getRoute(this.waypoints).subscribe(
      (data) => {
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
        }
        if (this.arrowLayer) {
          this.map.removeLayer(this.arrowLayer);
          this.arrowLayer = null; // Reset the arrowLayer reference
        }

        const routeCoordinates = this._plannerService.decodePolyline(
          data.routes[0].geometry
        );
        console.log(routeCoordinates);
        this.distance = data.routes[0].distance;
        this.duration = data.routes[0].duration;

        this.routeCoordinates = routeCoordinates;

        this.cdRef.detectChanges();

        this.markers[0].setLatLng(routeCoordinates[0]);
        this.markers[this.markers.length - 1].setLatLng(
          routeCoordinates[routeCoordinates.length - 1]
        );

        this.markers.forEach((marker, index) => {
          if (index === 0) {
            marker.setIcon(this.startIcon); // First marker gets the start icon
          } else if (index === this.markers.length - 1) {
            marker.setIcon(this.endIcon); // Last marker gets the end icon
          } else {
            marker.setIcon(this.midIcon); // All other markers get the other icon
          }
        });

        this.routeLayer = polyline(routeCoordinates, {
          color: '#DB2B35',
          weight: 7,
          opacity: 1,
        }).addTo(this.map);

        console.log(routeCoordinates);

        this.updatePolylineDecorator();
      },
      (error) => {
        console.error('Error fetching the route:', error);
      }
    );
  }
}
