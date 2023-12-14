import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'distanceConverter',
  pure: true,
})
export class DistanceConverterPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number' || value < 0) {
      return '';
    }

    if (value >= 1000) {
      const kilometers = value / 1000;
      return kilometers.toFixed(2) + ' km';
    } else {
      return value.toFixed(1) + ' m';
    }
  }
}
