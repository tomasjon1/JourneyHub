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

    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);
    const minutes = Math.round(((value % 86400) % 3600) / 60);

    let result = '';
    if (days > 0) {
      result += `${days} d `;
    }
    if (hours > 0 || days > 0) {
      result += `${hours} h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      result += `${minutes} m`;
    }

    return result ? result.trim() : '0.0 m';
  }
}
