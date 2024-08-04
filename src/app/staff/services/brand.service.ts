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
        return this.baseApiService.getMethod('Brand', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Brand/${id}`, {});
    }

    createOrUpdateData(params: any, id?: any) {
        const formData = new FormData();
        formData.append('Name', params?.Name);
        formData.append('Image', params?.Image);
        formData.append('CategoryId', params?.CategoryId);
        if(id) {
            return this.baseApiService.putMethod(`Brand/${id}`, formData);
        }
        return this.baseApiService.postMethod('Brand', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`Brand/${id}`);
    }
}
