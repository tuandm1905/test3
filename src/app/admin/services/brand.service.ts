import { Injectable } from '@angular/core';
import {BaseApiService} from "../helpers/base-api.service";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

    constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {
        if(params?.keyword) {
			return this.baseApiService.getMethod('Brand/search', params);
		}
        return this.baseApiService.getMethod('Brand', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Brand/${id}`, {});
    }

    createOrUpdateData(params: any, id?: any) {
        const formData = new FormData();
        formData.append('Name', params?.Name);
        formData.append('Image', params?.Image);
        if(id) {
            return this.baseApiService.putMethod(`Brand/${id}`, formData);
        }
        return this.baseApiService.postMethod('Brand', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`Brand/${id}`);
    }
}
