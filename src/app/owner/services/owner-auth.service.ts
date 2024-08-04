import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';
import { CommonService } from '../helpers/common.service';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";

@Injectable({
	providedIn: 'root'
})
export class OwnerAuthService {

	constructor(
		private baseApiService: BaseApiService,
		private commonService: CommonService
	) { }


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

	getUserInfo(token: any) {
		let header = new HttpHeaders({
			"Authentication": "Bearer " + token
		});
		
		return this.baseApiService.getMethod(`Authentication/Account`,{}, header);
	}

	decodeToken(token: any) {
		return  jwtDecode(token);
	}
}
