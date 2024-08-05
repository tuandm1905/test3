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
	getListWarehouse(params: any,id?:any) {
		const { warehouseId, page, pageSize } = params;
		return this.baseApiService.getMethod(`Warehouse/GetAllWarehouseDetailByWarehouse?warehouseId=${id}&page=${page}&pageSize=${pageSize}`,{});
										   // Warehouse/GetAllWarehouseDetailByWarehouse?warehouseId=18&page=1&pageSize=1
	}
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
	updateLocation(formData: any, id?: any) {
		return this.baseApiService.putMethod(`WarehouseDetail/UpdateWarehouseDetail`, formData, true);
	}
	getListSize(params: any) {
		const { page, pageSize, ownerId} = params;
		return this.baseApiService.getMethod(`ProductSize/GetAllProductSizes?page=${page}&pageSize=${pageSize}&ownerId=${ownerId}`, true);
										   // ProductSize/GetAllProductSizes?page=1&pageSize=10&ownerId=1
	}
}
