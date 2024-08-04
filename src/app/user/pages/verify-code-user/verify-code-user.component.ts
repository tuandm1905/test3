import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-code-user',
  templateUrl: './verify-code-user.component.html',
  styleUrl: './verify-code-user.component.scss'
})
export class VerifyCodeUserComponent {
  code: string[] = ['', '', '', '', '', ''];

  moveFocus(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > 1) {
      this.code[index] = value[0];
      input.value = value[0];
    }
    if (value.length === 1 && index < 5) {
      this.code[index] = value;
      document.getElementsByTagName('input')[index + 1].focus();
    }
    if (event.key === 'Backspace' && index > 0) {
      this.code[index] = '';
      document.getElementsByTagName('input')[index - 1].focus();
    }
  }

  verify() {
    const enteredCode = this.code.join('');
    console.log('Entered verification code:', enteredCode);
    // Add your verification logic here
  }

  resendCode() {
    console.log('Resend code clicked');
    // Add your resend code logic here
  }

  changeEmail() {
    console.log('Change email clicked');
    // Add your change email logic here
  }
}
