import { Component } from '@angular/core';

@Component({
  selector: 'app-login-user-page',
  templateUrl: './login-user-page.component.html',
  styleUrls: ['./login-user-page.component.scss']
})
export class LoginUserPageComponent {
  email: string = '';
  password: string = '';
  passwordFieldType: string = 'password';

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  forgotPassword() {
    console.log('Forgot Password clicked');
  }

}
