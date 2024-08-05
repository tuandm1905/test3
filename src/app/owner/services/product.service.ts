import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';
@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor(
		private baseApiService: BaseApiService
	) { }

	getLists(ownerId: any) {
		return this.baseApiService.getMethod(`Product/dashboard-owner/${ownerId}`, {});
	}
	searchData(data: any, id: any) {
		return this.baseApiService.getMethod(`Product/owner/searchs/${id}`, {});
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

	UpdateData(data: any, id: any) {
		return this.baseApiService.putMethod(`Product/${id}`, data);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Product/${id}`);
	}

	updateBan(id: any, status: any) {
		let url = `Product/`;
		if (!status) {
			url += `unban/${id}`
		} else {
			url += `ban/${id}`
		}
		return this.baseApiService.putMethod(url, {}, true);

	}
	getComments(productId: any) {
		return this.baseApiService.getMethod(`Comment`, { productId });
	}

	getListSize(params: any) {
		const { page, pageSize, ownerId} = params;
		return this.baseApiService.getMethod(`ProductSize/GetAllProductSizes?page=${page}&pageSize=${pageSize}&ownerId=${ownerId}`, {});
										   // ProductSize/GetAllProductSizes?page=1&pageSize=10&ownerId=1
	}
	deleteDataSize(id: any) {
		return this.baseApiService.patchMethod(`ProductSize/DeleteProductSize/${id}`, {});
	}




	getListsDescription(params: any) {
		return this.baseApiService.getMethod('Description/GetAllDescriptions', params);
	}

	showDescription(id: any) {
		return this.baseApiService.getMethod(`Product/${id}`, {});
	}
	getProductSizesByProductId(productId: number) {
		return this.baseApiService.getMethod(`ProductSize/GetProductSizeByProductId?productId=${productId}`,{});
	}
										   // ProductSize/GetProductSizeByProductId?productId=20'
	createOrUpdateDataDescription(data: any, id?: any) {
		const formData = this.baseApiService.setFormData(data);
		if (id) {
			return this.baseApiService.putMethod(`Description/UpdateDesctiption/${id}`, formData);
		}
		return this.baseApiService.postMethod('Description/CreateDesctiption', formData);
	}

	deleteDataDescription(id: any) {
		return this.baseApiService.patchMethod(`Description/DeleteDesctiption/${id}`, {});

	}


}
