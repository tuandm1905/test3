import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class WarehouseService {

	constructor(
		private baseApiService: BaseApiService
	) { }
	getLists(params: any) {
		return this.baseApiService.getMethod(`Warehouse/GetWarehouseByOwner/${params}`, {});
	}
	// searchData(data: any, id: any) {
	// 	return this.baseApiService.getMethod(`Product/owner/searchs/${id}`, {});
	// }
	show(id: any) {
		return this.baseApiService.getMethod(`Product/${id}`, {});
	}

	createOrUpdateData(data: any, id?: any) {
		const formData = this.baseApiService.setFormData(data);
		if (id) {
			return this.baseApiService.putMethod(`Product/${id}`, formData);
		}
		return this.baseApiService.postMethod('Product', formData);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Product/${id}`);
	}
}
