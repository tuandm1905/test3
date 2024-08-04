import { Injectable } from '@angular/core';
import {BaseApiService} from "../helpers/base-api.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
	constructor(
		private baseApiService: BaseApiService
	) { }

	getLists(params: any) {
        if(params?.keyword) {
			return this.baseApiService.getMethod('Service/GetAllServiceForUser', params);
		}
        return this.baseApiService.getMethod('Service/GetAllServiceForUser', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Service/GetServiceById/${id}`, {});
    }

    createOrUpdateData(formData: any, id?: any) {
       
        if(id) {
            return this.baseApiService.putMethod(`Service/UpdateService`, formData, true);
        }
        return this.baseApiService.postMethod('Service/CreateService', formData, true);
    }

    deleteData(id: any) {
        return this.baseApiService.patchMethod(`Service/DeleteService/${id}`, {});
    }
}
