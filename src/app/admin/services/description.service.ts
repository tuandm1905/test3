import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

	constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {
        return this.baseApiService.getMethod('Description/GetAllDescriptions', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Description/GetDescriptionById/${id}`, {});
    }

    createOrUpdateData(data: any, id?: any) {
		const formData = this.baseApiService.setFormData(data);
        if(id) {
			formData.append('AdId', id)
            return this.baseApiService.putMethod(`Description/UpdateDescription`, formData);
        }
        return this.baseApiService.postMethod('Description/CreateDescription', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`Description/DeleteDescription/${id}`);
    }
}
