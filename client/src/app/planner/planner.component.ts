import { Component, OnInit, inject } from '@angular/core';
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
  imports: [LeafletModule, PlannerOptionsComponent],
})
export class PlannerComponent implements OnInit {
  mapOptions!: MapOptions;
  map!: Map;
  waypoints: LatLng[] = [];
  markers: Marker[] = [];
  routeLayer: any;

  private arrowLayer: any; // for polyline decorator

  private _plannerService = inject(PlannerService);

  ngOnInit(): void {
    this.initializeMapOptions();
  }

  private initializeMapOptions(): void {
    this.mapOptions = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '...',
          zIndex: 10,
        }),
      ],
      zoom: 5,
      center: latLng(54.723079, 25.2333521),
    };
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.map.on('click', this.onMapClick.bind(this));
  }

  startIcon = new Icon({
    iconUrl: '../assets/starting-point-icon.svg',
    iconSize: [20, 20], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  otherIcon = new Icon({
    iconUrl: '../assets/mid-point-icon.svg',
    iconSize: [20, 20],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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

    if (this.waypoints.length > 1) {
      this.updateRoute();
    }
  }

  private onMarkerDragEnd(movedMarker: Marker): void {
    const index = this.markers.indexOf(movedMarker);
    this.waypoints[index] = movedMarker.getLatLng();

    // Update the route to reflect the new marker position
    this.updateRoute();
  }

  private updateRoute(): void {
    console.log(this.waypoints);
    if (this.waypoints.length < 2) {
      return; // Need at least two points to draw a route
    }

    this._plannerService.getRoute(this.waypoints).subscribe(
      (data) => {
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
        }

        if (this.arrowLayer) {
          this.map.removeLayer(this.arrowLayer);
        }

        // Assuming the API returns the route as an encoded polyline
        const routeCoordinates = decodePolyline(data.routes[0].geometry);
        this.routeLayer = polyline(routeCoordinates, {
          color: '#DB2B35',
          weight: 7,
          opacity: 1,
        }).addTo(this.map);

        // Add direction arrows using PolylineDecorator
        this.arrowLayer = new PolylineDecorator(this.routeLayer, {
          patterns: [
            {
              repeat: '300', // Adjust as needed for your map scale and polyline length
              offset: 40,
              symbol: Symbol.arrowHead({
                pixelSize: 15,
                pathOptions: {
                  color: '#0084A0', // Set color to white
                  fillOpacity: 1,
                  weight: 0, // Keep this smaller than the pixelSize
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
