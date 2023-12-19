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

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule, FormsModule, InputComponent],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loginValidationMessages = validationMessages.auth.login;

  constructor() {
    this.profileForm = this._formBuilder.group({
      email: [this.defaultState.email, [Validators.required, Validators.email]],
      userName: [this.defaultState.userName, [Validators.required]],
      newPassword: [this.defaultState.newPassword, [Validators.required]],
      confirmNewPassword: [
        this.defaultState.confirmNewPassword,
        [Validators.required],
      ],
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
  };

  userDetails: any;

  ngOnInit(): void {
    this._profileService.getUserProfile().subscribe({
      next: (response: any) => {
        this.userDetails = response.data;
        this.profileForm.patchValue({
          email: this.userDetails.email,
          userName: this.userDetails.userName,
          newPassword: this.userDetails.newPassword,
          confirmNewPassword: this.userDetails.confirmNewPassword,
        });
      },
      error: (error: any) => {},
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((field) => {
        const control = this.profileForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    // this._authService.login(this.signInForm.value).subscribe({
    //   next: (response: any) => {
    //     this._router.navigate(['/explore']);
    //   },
    //   error: (error: any) => {
    //     this._toastrService.error('', error.error.Error.Message);
    //   },
    // });
  }
}
