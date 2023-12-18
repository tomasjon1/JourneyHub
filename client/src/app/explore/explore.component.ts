import { Component, OnInit, inject } from '@angular/core';
import { PlannerService } from '../planner/planner.service';
import { CommonModule } from '@angular/common';
import { TrailItemComponent } from './trail-item/trail-item.component';
import { Observable } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';

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
  imports: [CommonModule, TrailItemComponent, FooterComponent],
})
export class ExploreComponent implements OnInit {
  trails: Trail[] = [];
  currentPage: number = 1;
  totalTrails: number = 0;
  isLoading: boolean = false;

  constructor(private plannerService: PlannerService) {}

  ngOnInit(): void {
    this.loadMoreTrails();
  }

  loadMoreTrails(): void {
    this.isLoading = true;
    const pageSize = 12; // Set page size to 12
    this.plannerService
      .getTrails(this.currentPage, pageSize)
      .subscribe((response) => {
        this.trails.push(...response.data);
        this.totalTrails = response.totalCount;
        this.currentPage++;
        this.isLoading = false;
      });
  }
}
