import { Component, OnInit, inject } from '@angular/core';
import { PlannerService } from '../planner/planner.service';
import { CommonModule } from '@angular/common';
import { TrailItemComponent } from './trail-item/trail-item.component';
import { Observable } from 'rxjs';

interface Trail {
  routeName: string;
  routeDescription: string;
  visibility: string;
  mapPoints: MapPoint[];
  mapMarkers: MapPoint[];
}

interface MapPoint {
  lat: number;
  lon: number;
}

@Component({
  standalone: true,
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  imports: [CommonModule, TrailItemComponent],
})
export class ExploreComponent implements OnInit {
  private _plannerService = inject(PlannerService);
  public trailItems$?: Observable<Trail[]>;

  ngOnInit(): void {
    this.trailItems$ = this._plannerService.getTrails();
  }
}
