import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

	constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {
        return this.baseApiService.getMethod('order', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`order/${id}`, {});
    }

    createOrUpdateData(formData: any, id?: any) {
		
        if(id) {
            return this.baseApiService.putMethod(`order/${id}`, formData);
        }
        return this.baseApiService.postMethod('order', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`order/${id}`);
    }
}
