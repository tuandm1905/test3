import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthService {

	constructor(
		private baseApiService: BaseApiService,
	) { }

	decodeToken(token: any) {
		return jwtDecode(token);
	}

	register(data: any) {
		return this.baseApiService.postMethod('Authentication/register-owner', data, true);
	}

	verifyCode(data: any) {
		return this.baseApiService.postMethod(`Authentication/verify-owner`, data, true);
	}

	login(formData: any) {
		let data = this.baseApiService.setFormData(formData)
		return this.baseApiService.postMethod('Authentication/login-shop', data);
	}

	getUserInfo(id: any) {
		return this.baseApiService.getMethod(`Staff/GetStaffById/${id}`, {});
	}

	updateProfile(data: any) {
		return this.baseApiService.putMethod(`Staff/UpdateProfileStaff`, data, true);
	}

	updateImage(data: any) {
		const params = this.baseApiService.setFormData(data);
		return this.baseApiService.putMethod(`Staff/UpdateAvatarStaff`, params);

	}

	changePassword(data: any) {
		const { staffId, oldPassword, newPassword, confirmPassword } = data;

		// Tạo URL với các tham số query string
		const url = `Staff/ChangePasswordStaff?staffId=${staffId}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`;
				  // Staff/ChangePasswordStaff?staffId=2&oldPassword=password123&newPassword=password1&confirmPassword=password1

		console.log('data password', data);
		console.log('URL password', url);

		// Gửi yêu cầu PUT với URL và không cần FormData
		return this.baseApiService.putMethod(url, true);
	}
}
