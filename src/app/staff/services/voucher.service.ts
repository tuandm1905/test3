import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

	constructor(
		private baseApiService: BaseApiService
	) { }

	getLists(params: any) {
        return this.baseApiService.getMethod('Voucher/GetAllVouchers', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Voucher/GetServiceById/${id}`, {});
    }

    createOrUpdateData(formData: any, id?: any) {
       
        if(id) {
            return this.baseApiService.putMethod(`Voucher/UpdateVoucher`, formData, true);
        }
        return this.baseApiService.postMethod('Voucher/CreateVoucher', formData, true);
    }

    deleteData(id: any) {
        return this.baseApiService.patchMethod(`Voucher/DeleteVoucher/${id}`, {});
    }
}
