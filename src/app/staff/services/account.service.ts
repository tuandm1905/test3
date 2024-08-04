import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class AccountService {

	constructor(
		private baseApiService: BaseApiService
	) { }


	getLists(params: any) {
		return this.baseApiService.getMethod('Account', params);
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Account/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			return this.baseApiService.putMethod(`Account/${id}`, params, true);
		}
		return this.baseApiService.postMethod('Account', params, true);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Account/${id}`);
	}

	updateBan(id: any, status: any) {
		let url = `Account/${id}/`;
		if(!status) {
			url += 'unban'
		} else {
			url += 'ban'
		}
		return this.baseApiService.putMethod(url, {}, true);

	}


	
}
