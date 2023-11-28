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

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
})
export class LoginComponent {
  signInForm: FormGroup;

  private _toastrService = inject(ToastrService);
  private _formBuilder = inject(FormBuilder);
  private _meta = inject(Meta);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  constructor() {
    this._meta.addTag({
      name: 'Sign In',
      content: 'JournayHub Sign in page',
    });

    this.signInForm = this._formBuilder.group({
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
    });
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      Object.keys(this.signInForm.controls).forEach((field) => {
        const control = this.signInForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this._authService.login(this.signInForm.value).subscribe({
      next: (response: any) => {
        this._router.navigate(['/explore']);
      },
      error: (error: any) => {
        this._toastrService.error('', error.error.Error.Message);
      },
    });
  }
}
