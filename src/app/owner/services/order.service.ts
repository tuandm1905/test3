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
        console.log('getLists Params:', params); // Debug log

        if (params.codeOrder) {
            // Search by codeOrder
            console.log('Searching by codeOrder:', params.codeOrder); // Debug log
            return this.baseApiService.getMethod(`Order/search?codeOrder=${params.codeOrder}`, {});
        } else {
            // Fetch list with other parameters
            console.log('Fetching list with ownerId:', params.ownerId); // Debug log
            return this.baseApiService.getMethod(`Order/owner/${params.ownerId}`, {});
        }
    }

    getData(ownerId: number) {
        return this.baseApiService.getMethod(`Order/owner/${ownerId}`, {});
    }
    show(id: any) {
        return this.baseApiService.getMethod(`order/${id}`, {});
    }
    status(id: number, statusId: number) {
        return this.baseApiService.putMethod(`Order/confirm/${id}/${statusId}`, {});
    }
    detail(id: any) {
        return this.baseApiService.getMethod(`OrderDetail/${id}`, {});
    }
    createOrUpdateData(formData: any, id?: any) {

        if (id) {
            return this.baseApiService.putMethod(`order/${id}`, formData);
        }
        return this.baseApiService.postMethod('order', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`order/${id}`);
    }
}
