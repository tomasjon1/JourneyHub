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
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputComponent],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentPasswordForm: FormGroup;
  actionType: 'update' | 'delete' = 'update';

  loginValidationMessages = validationMessages.auth.login;

  private readonly _authService = inject(AuthService);

  constructor() {
    this.profileForm = this._formBuilder.group({
      email: [this.defaultState.email, [Validators.required, Validators.email]],
      userName: [this.defaultState.userName],
      newPassword: [this.defaultState.newPassword],
      confirmNewPassword: [this.defaultState.confirmNewPassword],
    });

    this.currentPasswordForm = this._formBuilder.group({
      currentPassword: ['', Validators.required],
    });
  }

  _profileService = inject(ProfileService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  private readonly _router = inject(Router);
  showModal = false;

  toggleConfirmation() {
    this.actionType = 'delete';
    this.showModal = !this.showModal;
  }

  toggleConfirmationAndUpdate() {
    this.actionType = 'update';
    this.showModal = true;
  }

  defaultState = {
    email: '',
    userName: '',
    newPassword: '',
    confirmNewPassword: '',
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

  verifyPasswordAndProceed(callback: () => void) {
    const currentPassword =
      this.currentPasswordForm.get('currentPassword')?.value;
    if (!currentPassword) {
      this._toastrService.error('Please enter your current password');
      return;
    }

    this._profileService.verifyPassword(currentPassword).subscribe({
      next: (isPasswordCorrect: boolean) => {
        if (isPasswordCorrect) {
          callback();
        } else {
          this._toastrService.error('Incorrect password. Unable to proceed.');
        }
      },
      error: (error: any) => {
        this._toastrService.error('Error during password verification');
        console.log(error);
      },
    });
  }

  onConfirmRemove() {
    this.verifyPasswordAndProceed(() => {
      if (this.actionType === 'delete') {
        this.deleteUserAccount();
      } else if (this.actionType === 'update') {
        this.updateUserProfile();
      }
    });
  }

  updateUserProfile() {
    this._profileService.updateUserProfile(this.profileForm.value).subscribe({
      next: (response: any) => {
        this._toastrService.success('Profile updated successfully');
        this._authService.logout();
        this._router.navigate(['/explore']);
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this._toastrService.error('Failed to update profile');
      },
    });
  }

  deleteUserAccount() {
    this._profileService.deleteUser().subscribe({
      next: () => {
        this._toastrService.success('Account deleted successfully');
        this._authService.logout();
        this._router.navigate(['/explore']);
      },
      error: (error: any) => {
        console.error('Error during account deletion:', error);
        if (error && error.status === 200) {
          this._toastrService.success('Account deleted successfully');
          this._authService.logout();
          this._router.navigate(['/explore']);
        } else {
          this._toastrService.error('Failed to delete account');
        }
      },
    });
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
        console.error('Error updating profile:', error);
        this._toastrService.error('Failed to update profile');
      },
    });
  }
}
