import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService, UserProfileData } from './profile.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../input/input.component';
import { validationMessages } from '../shared/content/validation-messages';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    InputComponent
  ],
})
export class ProfileComponent implements OnInit{

  userProfileValidationMessages = validationMessages.auth.register;

  userProfileForm: FormGroup;
  userProfileData: UserProfileData;

  defaultState = {
    username: 'username',
    email: 'email',
    password: 'password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm password',
  };

  private _formBuilder = inject(FormBuilder);
  private _profileService = inject(ProfileService);
  private _router = inject(Router)

  constructor() {
    this.userProfileData = { Username: '', Email: '' };

    this.userProfileForm = this._formBuilder.group(
      {
        username: [
          this.defaultState.username,
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(16),
            Validators.pattern('^[a-zA-Z0-9]*$'),
          ],
        ],
        email: [
          this.defaultState.email,
          [Validators.required, Validators.email],
        ],
        password: this.defaultState.password,
        newPassword: [
          this.defaultState.newPassword,
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$'
            ),
          ],
        ],
        confirmNewPassword: [
          this.defaultState.confirmNewPassword,
          Validators.required
        ]
      },
      {
        validator: this.mustMatch('newPassword', 'confirmNewPassword'),
      }
    )
  }

  ngOnInit() {
    this._profileService.getUserData()
    .subscribe(data => {
      this.userProfileData = data
    });
    console.log(this.userProfileData.Email);
  }

  onSubmit() {
  }

  initializeForm() {
    
  }

  mustMatch(newPassword: string, confirmNewPassword: string) {
    return (formGroup: FormGroup) => {
      const newPasswordControl = formGroup.controls[newPassword];
      const confirmNewPasswordControl = formGroup.controls[confirmNewPassword];

      if (
        confirmNewPasswordControl.errors &&
        !confirmNewPasswordControl.errors['mustMatch']
      ) {
        return;
      }

      if (newPasswordControl.value !== confirmNewPasswordControl.value) {
        confirmNewPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmNewPasswordControl.setErrors(null);
      }
    };
  }
}
