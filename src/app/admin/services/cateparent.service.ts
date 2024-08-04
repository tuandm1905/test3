import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';
@Injectable({
	providedIn: 'root'
})
export class CateParentService {

	constructor(
		private baseApiService: BaseApiService
	) { }

	
	getListCateParent(params: any) {
        // console.log('getListCateParent called with params:', params);
        if(params?.keyword) {
			return this.baseApiService.getMethod('CateParent/search', params);
		}
		return this.baseApiService.getMethod('CateParent', params);
	}

	showCategory(id: any) {
		return this.baseApiService.getMethod(`CateParent/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		const formData = this.baseApiService.setFormData(params)
		if(id) {
			return this.baseApiService.putMethod(`CateParent/${id}`, formData);
		}
		return this.baseApiService.postMethod('CateParent', formData);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`CateParent/${id}`);
	}


}
