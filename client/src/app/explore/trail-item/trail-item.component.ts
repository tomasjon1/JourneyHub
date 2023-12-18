import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DistanceConverterPipe } from 'src/app/shared/pipes/distance-converter.pipe';
import { DurationConverterPipe } from 'src/app/shared/pipes/duration-converter.pipe';

@Component({
  standalone: true,
  selector: 'app-trail-item',
  templateUrl: './trail-item.component.html',
  imports: [CommonModule, DistanceConverterPipe, DurationConverterPipe],
})
export class TrailItemComponent implements OnInit {
  @Input() trailItem: any;

  ngOnInit(): void {
    console.log(this.trailItem);
  }
}
