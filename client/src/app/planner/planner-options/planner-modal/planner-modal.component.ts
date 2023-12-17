import { CommonModule } from '@angular/common';
import { Component, inject, HostListener, Input } from '@angular/core';
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
import { PlannerService } from '../../planner.service';

@Component({
  standalone: true,
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.component.html',
  imports: [CommonModule, InputComponent, ReactiveFormsModule, FormsModule],
})
export class PlannerModalComponent {
  @Input() routeCoordinates: any;
  @Input() markers: any;

  showModal = false;
  currentPage = 1;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  saveRouteForm: FormGroup;

  defaultState = {
    routeName: '',
    routeDescription: '',
    routeVisibility: 'private',
  };

  @HostListener('window:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.showModal) {
      this.toggleModal();
    }
  }

  private _toastrService = inject(ToastrService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _router = inject(Router);
  private _plannerService = inject(PlannerService);

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
      routeDescription: [this.defaultState.routeDescription],
      visibility: [this.defaultState.routeVisibility, Validators.required],
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

    const markerCoords = this._plannerService.extractCoordsFromMarkers(
      this.markers
    );
    console.log('markers', markerCoords);
    const formData = {
      ...this.saveRouteForm.value,
      mapPoints: this.routeCoordinates,
      mapMarkers: markerCoords,
    };
    console.log(formData);
    this._plannerService.saveTrail(formData).subscribe({
      next: (response: any) => {
        this._toastrService.success('', 'Trail created successfully'),
          this._router.navigate(['/explore']);
      },
      error: (error: any) => {
        console.log(error);
        this._toastrService.error('', error.error.Error.Message);
      },
    });
  }
}
