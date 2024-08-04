import { Component } from '@angular/core';

@Component({
  selector: 'app-change-pw-user-page',
  templateUrl: './change-pw-user-page.component.html',
  styleUrls: ['./change-pw-user-page.component.scss']
})
export class ChangePwUserPageComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(field: string): void {
    if (field === 'currentPassword') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  isFormValid(): boolean {
    return this.newPassword === this.confirmPassword && this.newPassword.length > 0;
  }

  changePassword(): void {
    if (this.isFormValid()) {
      // Logic to change password
      alert('Password changed successfully!');
    }
  }
}
