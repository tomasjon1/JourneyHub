import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-input',
  templateUrl: './input.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class InputComponent {
  @Input() inputId = '';
  @Input() inputType = '';
  @Input() control = new FormControl();
  @Input() label = '';
  @Input() isRequired = false;
  @Input() customErrorMessages: Record<string, string> = {};

  get firstErrorMessage(): string | null {
    if (this.control.errors) {
      const firstErrorKey = Object.keys(this.control.errors)[0];
      const customMessage = this.customErrorMessages[firstErrorKey];
      return customMessage;
    }
    return null;
  }
}
