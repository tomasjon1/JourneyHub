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
      name: [this.defaultState.name, [Validators.required]],
    });
  }

  _profileService = inject(ProfileService);
  private _toastrService = inject(ToastrService);
  private _formBuilder = inject(NonNullableFormBuilder);

  defaultState = {
    email: '',
    name: '',
  };

  userDetails: any;

  ngOnInit(): void {
    this._profileService.getUserProfile().subscribe({
      next: (response: any) => {
        this.userDetails = response.data;
        this.profileForm.patchValue({
          email: this.userDetails.email,
          name: this.userDetails.userName, // if you have the password
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
