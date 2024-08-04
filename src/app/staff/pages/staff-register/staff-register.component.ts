import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { StaffAuthService } from '../../services/staff-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-register',
  templateUrl: './staff-register.component.html',
  styleUrl: './staff-register.component.scss'
})
export class StaffRegisterComponent {

	form: any = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(null, Validators.required),
		confirmPassword: new FormControl(null, Validators.required),
		fullname: new FormControl(null, Validators.required),
		phone: new FormControl(null, Validators.required),
		address: new FormControl(null, Validators.required),
	});
	submitted = false;
	showPassword = false;
	showConfirmPassword = false;

	loading = false;
	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private authService: StaffAuthService,
		private router: Router
	) {

	}

	type = 'REGISTER'



	isFieldInvalid(field: string): boolean {
		const control = this.form.get(field);
		return control ? control.invalid && (control.dirty || control.touched || this.submitted) : false;
	}

	resetFields(fields: string[]): void {
		fields.forEach(field => {
			this.form.get(field)?.reset();
		});
	}

	passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');
		if (password && confirmPassword && password.value !== confirmPassword.value) {
			return { passwordMismatch: true };
		}
		return null;
	}

	getPasswordClass(): string {
		const passwordControl = this.form.get('password');
		const confirmPasswordControl = this.form.get('confirmPassword');
		const passwordMismatch = this.form.hasError('passwordMismatch');

		if (!passwordControl?.touched && !confirmPasswordControl?.touched) {
			return '';
		} else if (passwordMismatch) {
			return 'error-password';
		} else if (passwordControl?.valid && confirmPasswordControl?.valid) {
			return 'valid-password';
		} else {
			return 'normal-password';
		}
	}

	getConfirmPasswordClass(): string {
		const passwordControl = this.form.get('password');
		const confirmPasswordControl = this.form.get('confirmPassword');
		const passwordMismatch = this.form.hasError('passwordMismatch');

		if (!passwordControl?.touched && !confirmPasswordControl?.touched) {
			return '';
		} else if (passwordMismatch) {
			return 'error-password';
		} else if (passwordControl?.valid && confirmPasswordControl?.valid) {
			return 'valid-password';
		} else {
			return 'normal-password';
		}
	}

	togglePasswordVisibility(): void {
		this.showPassword = !this.showPassword;
	}
	toggleConfirmPasswordVisibility(): void {
		this.showConfirmPassword = !this.showConfirmPassword;
	}

	onSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) {
			console.log('Form Values:', this.form.value);
			this.alertService.fireSmall('error', 'Form is invalid!');
			return;
		}
		this.loading = true;
		this.authService.register(this.form.value).subscribe((res: any) => {
			this.loading = false;
			console.log(res, typeof res);
			if (res?.text == 'Verification code sent. Please check your email.') {
				this.alertService.fireSmall('success', res?.text);
				this.type = 'CODE'
			} else if (res?.errors?.length > 0) {
				this.alertService.showListError(res?.errors)
			} else {
				this.alertService.fireSmall('error', res?.text);
			}
		});
	}

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
		this.loading = true;
		let data = {...this.form.value, code:  this.code.join('')}
		this.authService.verifyCode(data).subscribe((res: any) => {
			this.loading = false;
			
			if(res?.text?.includes('successful')) {
				this.alertService.fireSmall("success", res?.text);
				this.router.navigate(['/staff/auth/login'])
			} else if(res?.errors?.length > 0) {
				this.alertService.showListError(res?.errors);
			} else {
				this.alertService.fireSmall("error", res?.text);

			}
		});
	}
}
