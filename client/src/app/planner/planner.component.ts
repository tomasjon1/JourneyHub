import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
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

function decodePolyline(encoded: string): LatLng[] {
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

  private arrowLayer: any;

  private _plannerService = inject(PlannerService);
  private cdRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeMapOptions();
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
      center: latLng(54.723079, 25.2333521),
    };
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.map.on('click', this.onMapClick.bind(this));
    this.markers.forEach((marker) => {
      marker.on('click', (e) => this.onMarkerClick(e, marker));
    });
  }

  startIcon = new Icon({
    iconUrl: '../assets/starting-point-icon.svg',
    iconSize: [20, 20],
  });

  otherIcon = new Icon({
    iconUrl: '../assets/mid-point-icon.svg',
    iconSize: [20, 20],
  });

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

    let iconToUse =
      this.waypoints.length === 1 ? this.startIcon : this.otherIcon;

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
        }

        const routeCoordinates = decodePolyline(data.routes[0].geometry);

        this.distance = data.routes[0].distance;
        this.duration = data.routes[0].duration;

        this.routeCoordinates = routeCoordinates;

        this.cdRef.detectChanges();

        this.markers[0].setLatLng(routeCoordinates[0]);
        this.markers[this.markers.length - 1].setLatLng(
          routeCoordinates[routeCoordinates.length - 1]
        );

        this.routeLayer = polyline(routeCoordinates, {
          color: '#DB2B35',
          weight: 7,
          opacity: 1,
        }).addTo(this.map);

        console.log(routeCoordinates);

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
      },
      (error) => {
        console.error('Error fetching the route:', error);
      }
    );
  }
}
