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
import { LatLng } from 'leaflet';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary } from '@cloudinary/url-gen';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, throwError } from 'rxjs';
import { map } from 'rxjs';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import { MapService } from '../../map.service';

@Component({
  standalone: true,
  selector: 'app-planner-modal',
  templateUrl: './planner-modal.component.html',
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    FormsModule,
    CloudinaryModule,
  ],
})
export class PlannerModalComponent {
  @Input() routeCoordinates: LatLng[] = [];
  @Input() markers: any;
  @Input() distance: number = 0;
  @Input() duration: number = 0;

  private _mapService = inject(MapService);

  showModal = false;
  currentPage = 1;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  saveRouteForm: FormGroup;

  defaultState = {
    routeName: '',
    routeDescription: '',
    isPrivate: true,
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
  private _http = inject(HttpClient);

  planningfValidationMessages = validationMessages.planning;

  uploadedImages: string[] = [];

  constructor() {
    const cld = new Cloudinary({ cloud: { cloudName: 'db6w12g8o' } });

    this.saveRouteForm = this._formBuilder.group({
      routeName: [
        this.defaultState.routeName,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      routeDescription: [this.defaultState.routeDescription],
      isPrivate: [this.defaultState.isPrivate, Validators.required],
    });
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  selectedFiles: File[] = [];

  onFileSelected(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (this.selectedFiles.length >= 4) {
          this._toastrService.error('You can only upload up to 4 images.');
          break;
        }

        const file = event.target.files[i];
        if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
          this._toastrService.error(
            'Only PNG, JPG, and JPEG files are allowed.'
          );
          continue;
        }

        if (file.size > 5242880) {
          this._toastrService.error('File size cannot exceed 5MB.');
          continue;
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.uploadedImages.push(event.target.result);
        };

        this.selectedFiles.push(file);
        console.log(this.selectedFiles);
      }
    }
  }

  private uploadToCloudinary(file: File, uniqueId: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'db6w12g8o');
    formData.append('public_id', `file-${uniqueId}`);

    return this._http
      .post('https://api.cloudinary.com/v1_1/db6w12g8o/image/upload', formData)
      .pipe(
        map((response: any) => response.url),
        catchError((error) => {
          console.error('Upload error:', error);
          this._toastrService.error('Error uploading image.');
          return throwError(error);
        })
      );
  }

  deleteImage(index: number) {
    this.uploadedImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
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
    const coordinates = this.routeCoordinates.map((location, index) => ({
      order: index,
      ...location,
    }));

    // const uploadScreenshotObservable =
    //   this.uploadToCloudinary(screenshotFile);
    const uploadObservables = this.selectedFiles.map((file, index) =>
      this.uploadToCloudinary(file, `file-${index}-${file.name}`)
    );
    // uploadObservables.push(uploadScreenshotObservable);

    forkJoin(uploadObservables).subscribe({
      next: (imageUrls) => {
        const formData = {
          ...this.saveRouteForm.value,
          mapPoints: coordinates,
          mapMarkers: markerCoords,
          distance: this.distance,
          duration: this.duration,
          images: imageUrls,
        };

        this._plannerService.saveTrail(formData).subscribe({
          next: (response: any) => {
            this._toastrService.success('Trail created successfully');
            this._router.navigate(['/trail', response.data.id]);
          },
          error: (error: any) => {
            console.error('Error saving trail:', error);
            this._toastrService.error('Failed to save trail.');
          },
        });
      },
      error: (error) => {
        console.error('Error during image upload:', error);
        this._toastrService.error('Failed to upload images.');
      },
    });
  }
}
