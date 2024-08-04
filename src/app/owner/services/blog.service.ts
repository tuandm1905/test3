import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

	constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {
        const { searchQuery, page, pageSize, ownerId } = params;
        return this.baseApiService.getMethod('Advertisement/GetAdvertisementsByOwner',{ searchQuery, page, pageSize, ownerId });
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Advertisement/${id}`, {});
    }

    createOrUpdateData(data: any, id?: any) {
		const formData = this.baseApiService.setFormData(data);
        if(id) {
			formData.append('AdId', id)
            return this.baseApiService.putMethod(`Advertisement/UpdateAdvertisement`, formData);
        }
        return this.baseApiService.postMethod('Advertisement/CreateAdvertisement', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`Advertisement/${id}`);
    }
}
