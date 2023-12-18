import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [],
})
export class ProfileComponent {

  userProfileForm: FormGroup;

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
    this._profileService
    this.userProfileForm = this._formBuilder.group(
      {
        username: [
          this.defaultState.username,
        ],
        email: [
          this.defaultState.email,
        ],
      }
    )
  }

  onSubmit() {

  }

}
