import { Component } from '@angular/core';
import { AuthenService } from '../../services/authen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../helpers/alert.service';

@Component({
	selector: 'app-login-admin-page',
	templateUrl: './login-admin-page.component.html',
	styleUrl: './login-admin-page.component.scss'
})
export class LoginAdminPageComponent {
	email: string = '';
	password: string = '';
	passwordFieldType: string = 'password';
	loginForm: FormGroup;
	submitted = false;
	loginError: string | null = null;
	showPassword: boolean = false;

	constructor(
		private fb: FormBuilder,
		private authenService: AuthenService,
		private alertService: AlertService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			Email: ['', [Validators.required, Validators.email]],
			Password: ['', [Validators.required]]
		});
	}
	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
		this.passwordFieldType = this.showPassword ? 'text' : 'password';
	}
	forgotPassword() {
		this.router.navigate(['/verify-email']);
	}

	navigateToRegister() {
		this.router.navigate(['/register-user']);
	}
	navigateToOwnerLogin() {
		this.router.navigate(['/owner/auth/login']);
	}
	onSubmit() {
		this.submitted = true;
		this.loginError = null;
		console.log(this.loginForm.value);
		if (this.loginForm.valid) {
			this.authenService.loginAdmin(this.loginForm.value).subscribe(
				response => {
					if (response && response.token) {
						localStorage.setItem('userType', response.userType || 'User');
						localStorage.setItem('token', response.token);
						let data = this.authenService.decodeToken(response?.token);
						if (!data) {
							this.alertService.fireSmall('success', "Login failed!");
							return;
						}
						let userType: string | null = null;
						let user: any = {};

						Object.entries(data).forEach((item: any) => {
							console.log('12312312312312312312312',item);
							if (item[0] == `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`) {
								user.userType = item[1] || null
							}
							if (item[0] == `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`) {
								user.email = item[1] || null;
								user.name = item[1] || null;
							}
							if (item[0] == `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`) {
								user.id = item[1] || null
							}
						});
						 // Lưu thông tin người dùng và userType vào localStorage
						 localStorage.setItem('user', JSON.stringify(user));
						 localStorage.setItem('userType', userType || 'Admin'); // Lưu userType
						this.router.navigate(['/admin']);
					} else {
						this.alertService.fireSmall('error', response?.messsage || 'Login failed: No token received')
						this.loginError = 'Login failed: No token received';
					}
				},
				error => {
					console.error('Login failed', error);
					this.loginError = error.error?.message || 'Something went wrong';
				}
			);
		}
	}
}
