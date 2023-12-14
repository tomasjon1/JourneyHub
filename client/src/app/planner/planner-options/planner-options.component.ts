import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Marker {
  lat: string;
  lon: string;
}

@Component({
  standalone: true,
  selector: 'app-planner-options',
  templateUrl: './planner-options.component.html',
  imports: [CommonModule],
})
export class PlannerOptionsComponent {
  @Input() markers: Marker[] = [];
}
