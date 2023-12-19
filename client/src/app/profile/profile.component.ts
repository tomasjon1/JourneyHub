import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from './profile.service';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ToastrService } from 'ngx-toastr';
import { validationMessages } from '../shared/content/validation-messages';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputComponent],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loginValidationMessages = validationMessages.auth.login;

  constructor() {
    this.profileForm = this._formBuilder.group({
      email: [this.defaultState.email, [Validators.required, Validators.email]],
      userName: [this.defaultState.userName],
      newPassword: [this.defaultState.newPassword],
      currentPassword: [
        this.defaultState.currentPassword,
        [Validators.required],
      ],
      confirmNewPassword: [this.defaultState.confirmNewPassword],
    });
  }

  _profileService = inject(ProfileService);
  private _toastrService = inject(ToastrService);
  private _formBuilder = inject(NonNullableFormBuilder);
  showModal = false;

  toggleConfirmation() {
    this.showModal = !this.showModal;
  }

  defaultState = {
    email: '',
    userName: '',
    newPassword: '',
    confirmNewPassword: '',
    currentPassword: '',
  };

  userDetails: any;

  ngOnInit(): void {
    this._profileService.getUserProfile().subscribe({
      next: (response: any) => {
        this.userDetails = response.data;
        this.profileForm.patchValue({
          email: this.userDetails.email,
          userName: this.userDetails.userName,
        });
      },
      error: (error: any) => {},
    });
  }

  onConfirmRemove() {
    this.onApplyChanges();
    this.showModal = false;
  }

  onApplyChanges() {}

  onCancelRemove() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((field) => {
        const control = this.profileForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this._profileService.updateUserProfile(this.profileForm.value).subscribe({
      next: (response: any) => {
        this._toastrService.success('Profile updated successfully');
      },
      error: (error: any) => {
        console.error('Error saving trail:', error);
        this._toastrService.error('Failed to update profile');
      },
    });
  }
}
