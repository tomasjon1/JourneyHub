import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from 'src/app/input/input.component';
import { validationMessages } from 'src/app/shared/content/validation-messages';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
  ],
})
export class RegisterComponent {
  signUpForm: FormGroup;

  registerValidationMessages = validationMessages.auth.register;

  defaultState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  private _toastrService = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _meta = inject(Meta);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  constructor() {
    this._meta.addTag({
      name: 'Sign Up',
      content: 'JourneyHub Sign Up page',
    });
    this.signUpForm = this._formBuilder.group(
      {
        name: [
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
        password: [
          this.defaultState.password,

          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$'
            ),
          ],
        ],
        confirmPassword: [
          this.defaultState.confirmPassword,
          Validators.required,
        ],
      },
      {
        validator: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['mustMatch']
      ) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      Object.keys(this.signUpForm.controls).forEach((field) => {
        const control = this.signUpForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this._authService.register(this.signUpForm.value).subscribe({
      next: (response: any) => {
        this._toastrService.success('', 'Account created successfully'),
          this._router.navigate(['/explore']);
      },
      error: (error: any) => {
        this._toastrService.error('', error.error.Error.Message);
      },
    });
  }
}
