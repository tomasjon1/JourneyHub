import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { PlannerService } from 'src/app/planner/planner.service';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';
import { DurationConverterPipe } from 'src/app/shared/pipes/duration-converter.pipe';
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

import 'leaflet-polylinedecorator';
import { PolylineDecorator } from 'leaflet';
import { FooterComponent } from 'src/app/footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/profile/profile.service';

interface Location {
  order?: number;
  lat: number;
  lng: number;
}

@Component({
  standalone: true,
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  imports: [
    CommonModule,
    LeafletModule,
    DistanceConverterPipe,
    DurationConverterPipe,
    FooterComponent,
  ],
})
export class TrailComponent implements OnInit {
  private _plannerService = inject(PlannerService);
  private _route = inject(ActivatedRoute);
  trail: any;
  routeLayer: any;
  private arrowLayer: any;
  mapOptions!: MapOptions;
  map!: Map;
  expandedMap!: Map;
  waypoints: LatLng[] = [];
  markers: Marker[] = [];
  public mapHovered = false;
  mapInitialized = false;
  expandView = false;
  showModal = false;
  isAuthor = false;

  private _toastrService = inject(ToastrService);
  private _router = inject(Router);
  private _profileService = inject(ProfileService);

  toggleMapExpansion() {
    this.expandView = !this.expandView;
    if (this.expandView) {
      // Initialize or update options for the expanded map
      this.initializeMapOptions(
        this.trail.mapPoints[0],
        this.trail.mapPoints.length
      );

      // Update polyline decorator for the expanded map
      if (this.expandedMap) {
        this.expandedMap.removeLayer(this.arrowLayer);
        this.arrowLayer = null;
      }
    }
  }

  private getMidpoint(trailPoints: Location[]): Location {
    const sortedPoints = this.removeOrderAndSort(trailPoints);
    const midIndex = Math.floor(sortedPoints.length / 2);
    return sortedPoints[midIndex];
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.renderRoute(this.trail.mapPoints, this.map);
    map.on('zoomend', () => this.updatePolylineDecorator(map));
  }
  onExpandedMapReady(map: Map): void {
    this.expandedMap = map;
    this.renderRoute(this.trail.mapPoints, this.expandedMap);
    map.on('zoomend', () => this.updatePolylineDecorator(map));
  }

  toggleConfirmation() {
    this.showModal = !this.showModal;
  }

  ngOnInit(): void {
    const trailId = this._route.snapshot.paramMap.get('id');

    const userData: {
      userId: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (trailId)
      this._plannerService.getTrail(trailId).subscribe({
        next: (response: any) => {
          this.trail = response.data;
          if (this.trail.mapPoints) {
            console.log(this.trail.userId, response.data.userId);
            if (this.trail.userId === userData.userId) this.isAuthor = true;
            const firstPoint = this.trail.mapPoints[0];
            const midpoint = this.getMidpoint(this.trail.mapPoints);
            this.initializeMapOptions(midpoint, this.trail.mapPoints.length);
          }
        },
        error: (error: any) => {
          this._router.navigate(['/explore']);
        },
      });
  }

  private determineZoomLevel(pointsCount: number): number {
    if (pointsCount < 100) {
      return 17;
    } else if (pointsCount < 1000) {
      return 10;
    } else {
      return 8;
    }
  }

  private initializeMapOptions(midpoint: Location, pointsCount: number): void {
    const zoomLevel = this.determineZoomLevel(pointsCount);

    this.mapOptions = {
      zoom: zoomLevel,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '...',
          zIndex: 10,
        }),
      ],
      center: latLng(midpoint.lat, midpoint.lng),
    };
  }

  private updatePolylineDecorator(map: Map): void {
    const currentZoom = map.getZoom();

    if (currentZoom >= 10) {
      if (!this.arrowLayer) {
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
        }).addTo(map);
      }
    } else {
      if (this.arrowLayer) {
        map.removeLayer(this.arrowLayer);
        this.arrowLayer = null;
      }
    }
  }

  onConfirmRemove() {
    this.onDeleteTrail();
    this.showModal = false;
  }

  onCancelRemove() {
    this.showModal = false;
  }

  onDeleteTrail() {
    const trailId = this._route.snapshot.paramMap.get('id');
    this._plannerService.deleteTrail(trailId).subscribe({
      next: (response: any) => {
        this._toastrService.success('Trail deleted successfully');
        this._router.navigate(['/my-trails']);
      },
      error: (error: any) => {
        console.error('Error saving trail:', error);
        this._toastrService.error('Failed to delete trail');
      },
    });
  }

  startIcon = new Icon({
    iconUrl: '../assets/starting-point-icon.svg',
    iconSize: [20, 20],
  });

  endIcon = new Icon({
    iconUrl: '../assets/end-point-icon.svg',
    iconSize: [20, 20],
  });

  private removeOrderAndSort(locations: Location[]): Omit<Location, 'order'>[] {
    locations.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return locations.map(({ order, ...rest }) => rest);
  }
  private renderRoute(trailPoints: any, map: Map): void {
    trailPoints = this.removeOrderAndSort(trailPoints);
    this.routeLayer = polyline(trailPoints, {
      color: '#DB2B35',
      weight: 7,
      opacity: 1,
    }).addTo(map);

    const startPoint = new LatLng(trailPoints[0].lat, trailPoints[0].lng);
    const startMarker = new Marker(startPoint, { icon: this.startIcon }).addTo(
      map
    );

    const endPoint = new LatLng(
      trailPoints[trailPoints.length - 1].lat,
      trailPoints[trailPoints.length - 1].lng
    );
    const finishMarker = new Marker(endPoint, { icon: this.endIcon }).addTo(
      map
    );
  }
}
