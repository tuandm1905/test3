import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify-email-user',
  templateUrl: './verify-email-user.component.html',
  styleUrl: './verify-email-user.component.scss'
})
export class VerifyEmailUserComponent {
  emailForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      // Handle form submission
      console.log('Email:', this.emailForm.value.email);
    }
  }
}
