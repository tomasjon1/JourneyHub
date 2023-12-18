import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';
import { DurationConverterPipe } from 'src/app/shared/pipes/duration-converter.pipe';

@Component({
  standalone: true,
  selector: 'app-trail',
  templateUrl: './trail.component.html',
  imports: [CommonModule, DistanceConverterPipe, DurationConverterPipe],
})
export class TrailComponent {}
