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

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
})
export class LoginComponent {
  signInForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private meta: Meta
    ) {
    this.meta.addTag({
      name: 'Sign In',
      content: 'JournayHub Sign in page'
    })

    this.signInForm = this.formBuilder.group({
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

    console.warn(this.signInForm.value);
  }
}
