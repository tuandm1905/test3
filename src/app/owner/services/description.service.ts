import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

    constructor(
        private baseApiService: BaseApiService
    ) { }

    // Lấy danh sách các mô tả
    getLists(params: any) {
        return this.baseApiService.getMethod('Description/GetAllDescriptions', params);
    }

    // Hiển thị một mô tả theo ID
    show(id: any) {
        return this.baseApiService.getMethod(`Description/GetDescriptionById/${id}`, {});
    }

    createOrUpdateData(data: any, id?: any) {
        const formData = this.baseApiService.setFormData(data);

        if (id) {
            formData.append('DescriptionId', id)
            return this.baseApiService.putMethod('Description/UpdateDesctiption', formData); 
        }
        return this.baseApiService.postMethod('Description/CreateDesctiption', formData);
    }
    

    deleteData(id: number) {
        return this.baseApiService.patchMethod(`Description/DeleteDesctiption/${id}`,true);
    }
}
