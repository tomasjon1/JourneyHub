import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';

interface Marker {
  lat: string;
  lon: string;
}

@Component({
  standalone: true,
  selector: 'app-planner-options',
  templateUrl: './planner-options.component.html',
  imports: [CommonModule, DistanceConverterPipe],
})
export class PlannerOptionsComponent {
  @Input() markers: Marker[] = [];
  @Input() distance:number = 0;
}
