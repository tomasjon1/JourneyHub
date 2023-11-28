import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
})
export class RegisterComponent {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private meta: Meta,
    private authService: AuthService
    ) {
    this.meta.addTag({
      name: "Sign Up",
      content : "JourneyHub Sign Up page"
    })
    this.signUpForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(16),
            Validators.pattern('^[a-zA-Z0-9]*$'),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%]).{8,}$'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  get username() {
    return this.signUpForm.get('username');
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
    
    console.log(this.signUpForm.value)

    this.authService.register(this.signUpForm.value).subscribe({
      next: (response: any) => {
        console.log('Registration successful', response);
      },
      error: (error: any) => {
        console.error('Registration failed', error);
      },
    });
  }
}
