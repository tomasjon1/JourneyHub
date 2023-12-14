import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';
import { DurationConverterPipe } from 'src/app/shared/pipes/duration-converter.pipe';

interface Marker {
  lat: string;
  lon: string;
}

@Component({
  standalone: true,
  selector: 'app-planner-options',
  templateUrl: './planner-options.component.html',
  imports: [CommonModule, DistanceConverterPipe, DurationConverterPipe],
})
export class PlannerOptionsComponent {
  @Input() markers: Marker[] = [];
  @Input() distance: number = 0;
  @Input() duration: number = 0;
  @Output() modeChangeEvent = new EventEmitter<boolean>();
  isAddMode: boolean = true;

  toggleMode(newMode: boolean): void {
    this.isAddMode = newMode;
    this.modeChangeEvent.emit(newMode);
  }
}
