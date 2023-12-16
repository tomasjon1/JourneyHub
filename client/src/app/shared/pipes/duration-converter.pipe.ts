import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'durationConverter',
  pure: true,
})
export class DurationConverterPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number' || value < 0) {
      return '';
    }

    const totalMinutes = value / 60;
    const totalHours = value / 3600;
    const totalDays = value / 86400;

    if (totalDays >= 1) {
      return `${totalDays.toFixed(1)} d`;
    } else if (totalHours >= 1) {
      return `${totalHours.toFixed(1)} h`;
    } else {
      return `${totalMinutes.toFixed(1)} m`;
    }
  }
}
