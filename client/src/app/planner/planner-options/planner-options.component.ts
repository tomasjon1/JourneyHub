import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';
import { DurationConverterPipe } from 'src/app/shared/pipes/duration-converter.pipe';
import { PlannerModalComponent } from './planner-modal/planner-modal.component';

@Component({
  standalone: true,
  selector: 'app-planner-options',
  templateUrl: './planner-options.component.html',
  imports: [
    CommonModule,
    DistanceConverterPipe,
    DurationConverterPipe,
    PlannerModalComponent,
  ],
})
export class PlannerOptionsComponent {
  @Input() distance: number = 0;
  @Input() duration: number = 0;
  @Input() waypoints: any;
  @Output() modeChangeEvent = new EventEmitter<boolean>();
  isAddMode: boolean = true;

  toggleMode(newMode: boolean): void {
    this.isAddMode = newMode;
    this.modeChangeEvent.emit(newMode);
  }
}
