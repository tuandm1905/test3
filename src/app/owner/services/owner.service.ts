import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class OwnerService {

	constructor(
		private baseApiService: BaseApiService
	) { }

	getLists(params: any) {
		return this.baseApiService.getMethod('Owner/GetAllOwners', params);
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Owner/GetOwnerById/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			return this.baseApiService.putMethod(`Owner/UpdateOwner`, params, true);
		}
		return this.baseApiService.postMethod('Owner/CreateOwner', params, true);
	}

	updateOwnerProfile(data: any) {
		return this.baseApiService.putMethod(`Owner/UpdateProfileOwner`, data, true);
	}

	updateOwnerImage(data: any) {
		const params = this.baseApiService.setFormData(data);
		return this.baseApiService.putMethod(`Owner/UpdateAvatarOwner`, params);
	}

	changePassword(data: any) {
		const { ownerId, oldPassword, newPassword, confirmPassword } = data;

		// Tạo URL với các tham số query string
		const url = `Owner/ChangePasswordOwner?ownerId=${ownerId}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`;

		console.log('data password', data);
		console.log('URL password', url);

		// Gửi yêu cầu PUT với URL và không cần FormData
		return this.baseApiService.putMethod(url, true);
	}




	updateBan(id: any, status: any) {
		let url = `Owner/${id}/`;
		if (!status) {
			url += 'UnBanOwner'
		} else {
			url += 'BanOwner'
		}
		return this.baseApiService.patchMethod(url, {}, true);

	}
}
