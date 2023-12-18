import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';
import { DurationConverterPipe } from 'src/app/shared/pipes/duration-converter.pipe';

@Component({
  standalone: true,
  selector: 'app-trail-item',
  templateUrl: './trail-item.component.html',
  imports: [CommonModule, DistanceConverterPipe, DurationConverterPipe],
})
export class TrailItemComponent {
  @Input() trailItem: any;

  private _router = inject(Router);

  openTrail(trailId: string) {
    this._router.navigate(['/trail', trailId]);
  }
}
