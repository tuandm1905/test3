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
		console.log(params);
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
