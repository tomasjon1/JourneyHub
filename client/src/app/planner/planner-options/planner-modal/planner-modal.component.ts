import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from 'src/app/input/input.component';
import { validationMessages } from 'src/app/shared/content/validation-messages';

@Component({
  standalone: true,
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.component.html',
  imports: [CommonModule, InputComponent, ReactiveFormsModule, FormsModule],
})
export class PlannerModalComponent {
  showModal = true;
  currentPage = 1;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  saveRouteForm: FormGroup;

  defaultState = {
    routeName: '',
    routeDesc: '',
  };

  private _toastrService = inject(ToastrService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _router = inject(Router);

  planningfValidationMessages = validationMessages.planning;

  uploadedImages: string[] = [];

  constructor() {
    this.saveRouteForm = this._formBuilder.group({
      routeName: [
        this.defaultState.routeName,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ],
      ],
      routeDesc: [this.defaultState.routeDesc],
    });
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  onFileSelected(event: any) {
    if (event.target.files && this.uploadedImages.length < 4) {
      for (let file of event.target.files) {
        // Check for file type and size
        if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
          this._toastrService.error(
            'Only PNG, JPG, and JPEG files are allowed.'
          );
          continue;
        }

        if (file.size > 5242880) {
          // 5MB in bytes
          this._toastrService.error('File size cannot exceed 5MB.');
          continue;
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.uploadedImages.push(event.target.result);
        };
      }
    } else if (this.uploadedImages.length >= 4) {
      this._toastrService.error('You can only upload up to 4 images.');
    }
  }

  deleteImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  onSubmit() {
    if (this.saveRouteForm.invalid) {
      Object.keys(this.saveRouteForm.controls).forEach((field) => {
        const control = this.saveRouteForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
  }
}
