import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class StaffService {

	constructor(
		private baseApiService: BaseApiService
	) { }
	getLists(params: any) {
		const { searchQuery, page, pageSize, ownerId } = params;
		return this.baseApiService.getMethod('Staff/GetAllStaffs', { searchQuery, page, pageSize, ownerId });
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Staff/GetStaffById/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		const formData = this.baseApiService.setFormData(params);
		if (id) {
			return this.baseApiService.putMethod(`Staff/UpdateProfileStaff`, params, true);
		}
		console.log('data API',params)
		return this.baseApiService.postMethod('Staff/CreateStaff', formData);
	}
	// updateAvatar(image: File, staffId: number) {
	// 	const formData = new FormData();
	// 	formData.append('StaffId', staffId.toString());
	// 	formData.append('Image', image);

	// 	return this.baseApiService.putMethod('Staff/UpdateAvatarStaff', formData, true);
	//   }
	updateImage(data: any) {
		const params = this.baseApiService.setFormData(data);
		return this.baseApiService.putMethod(`Staff/UpdateAvatarStaff`, params);

	}
	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Staff/DeleteStaff/${id}`);
	}
}
