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

    UpdateData(data: any, id?: any) {

        if (id) {
            return this.baseApiService.putMethod('Description/UpdateDesctiption', data); // Cập nhật URL nếu cần
        }
    }
        create(data: any) {
        return this.baseApiService.postMethod('Description/CreateDesctiption', data);
    }
    

    deleteData(id: number) {
        return this.baseApiService.patchMethod(`Description/DeleteDescription/${id}`, {});
    }
}
