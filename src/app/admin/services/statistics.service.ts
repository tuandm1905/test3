import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private baseApiService: BaseApiService) { }

  account(params: any) {
    return this.baseApiService.getMethod('Account/account-statistics', params);
  }
  blog(ownerId: number) {
    return this.baseApiService.getMethod('Advertisement/AdversisementStatistics', { ownerId });
  }
  order(params: any) {
    return this.baseApiService.getMethod('Order/order-statistics', params);
  }
  orderOwner(ownerId: number) {
    return this.baseApiService.getMethod(`Order/owner-statistics/${ownerId}`,true);
  }
  product(ownerId: any) {
		return this.baseApiService.getMethod(`Product/dashboard-owner/${ownerId}`, {});
	}
  productTop5(ownerId: any) {
    return this.baseApiService.getMethod(`Product/top5/${ownerId}`,{});
  }
  guestconsultation(params: any) {
    return this.baseApiService.getMethod('GuestConsultation/ViewGuestConsultationStatistics', true);
  }
  VoucherStatistics(ownerId: any) {
    return this.baseApiService.getMethod('Voucher/VoucherStatistics',{ownerId});
  }
  WarehouseDetail(warehouseId: any) {
    return this.baseApiService.getMethod('WarehouseDetail/SumOfKindProdSizeStatistics',{warehouseId});
  }
  importproduct(params: any) {
		const {warehouseId, importId, ownerId } = params;
		return this.baseApiService.getMethod('ImportProduct/ViewImportProductStatistics', { warehouseId, importId, ownerId });
	}
}
