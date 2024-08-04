import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private baseApiService: BaseApiService
	) { }


	getListCategory(params: any) {
		if(params?.keyword) {
			return this.baseApiService.getMethod('Category/search', params);
		}
		return this.baseApiService.getMethod('Category', params);
	}

	getListCategoryParent(params: any) {
		return this.baseApiService.getMethod('CateParent', params);
	}

	showCategory(id: any) {
		return this.baseApiService.getMethod(`Category/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		const formData = this.baseApiService.setFormData(params)
		if(id) {
			return this.baseApiService.putMethod(`Category/${id}`, formData);
		}
		return this.baseApiService.postMethod('Category', formData);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Category/${id}`);
	}


}
