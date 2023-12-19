import { Component, OnInit, inject } from '@angular/core';
import { PlannerService } from '../planner/planner.service';
import { CommonModule } from '@angular/common';
import { TrailItemComponent } from './trail-item/trail-item.component';
import { Observable } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute } from '@angular/router';

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
  mode: 'explore' | 'my-trails' = 'explore';

  pageDescription = {
    explore: {
      title: 'Find your next journey',
      subtitle:
        'Discover the beauty of the great outdoors through the lenses of top explorers Craving more wilderness? Delve into our extensive repository of trails and find your next journey..',
    },
    'my-trails': {
      title: 'All of your journeys in one place',
      subtitle:
        'Rediscover the beauty of the great outdoors through the lenses of your own experiences',
    },
  };

  constructor(private plannerService: PlannerService) {}

  private _route = inject(ActivatedRoute);

  ngOnInit(): void {
    this._route.url.subscribe((url) => {
      this.mode = url[0].path === 'my-trails' ? 'my-trails' : 'explore';
      this.loadTrails();
    });
  }

  loadTrails(): void {
    this.isLoading = true;
    const pageSize = 12;

    let observable: Observable<any>;
    if (this.mode === 'my-trails') {
      observable = this.plannerService.getUserTrails(
        this.currentPage,
        pageSize
      );
    } else {
      observable = this.plannerService.getTrails(this.currentPage, pageSize);
    }

    observable.subscribe((response) => {
      this.trails.push(...response.data);
      this.totalTrails = response.totalCount;
      this.currentPage++;
      this.isLoading = false;
    });
  }
}
