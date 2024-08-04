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
		if(params?.keyword) {
			return this.baseApiService.getMethod('Owner/GetAllOwners', params);
		}
		return this.baseApiService.getMethod('Owner/GetAllOwners', params);
	}

	show(id: any) {
		console.log('owner',id);
		return this.baseApiService.getMethod(`Owner/GetOwnerById/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			console.log(params);
			return this.baseApiService.putMethod(`Owner/UpdateOwner`, params, true);
		}
		return this.baseApiService.postMethod('Owner/CreateOwner', params, true);
	}

	updateBan(id: any, status: any) {
		let url = `Owner/`;
		if (!status) {
			url += `UnBanOwner/${id}`
		} else {
			url += `BanOwner/${id}`
		}
		return this.baseApiService.patchMethod(url, {}, true);

	}
}
