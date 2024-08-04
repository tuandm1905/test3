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
		if(params?.keyword) {
			return this.baseApiService.getMethod('Account/search', params);
		}
		return this.baseApiService.getMethod('Account', params);
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Account/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			return this.baseApiService.putMethod(`Account/${id}/update-profile`, params, true);
		}
		return this.baseApiService.postMethod('Account', params, true);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Account/${id}`);
	}

	updateBan(id: any, status: any) {
		let url = `Account/`;
		if(!status) {
			url += `unban/${id}/`
		} else {
			url += `ban/${id}/`
		}
		return this.baseApiService.putMethod(url, {}, true);

	}
	statistics(params: any){
		return this.baseApiService.getMethod('Account/account-statistics', params);
	}
	
}
