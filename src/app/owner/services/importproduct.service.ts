import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ImportproductService {

  constructor(private baseApiService: BaseApiService) { }
  getLists(warehouseId: any) {
		return this.baseApiService.getMethod('ImportProduct/GetAllImportProduct',{warehouseId});
	}
  create(ownerId: number, warehouseId: number, origin: string, data:any){
    return this.baseApiService.postMethod(`ImportProduct/CreateImportProduct?ownerId=${ownerId}&warehouseId=${warehouseId}&origin=${origin}`,data)
                                        // ImportProduct/CreateImportProduct?ownerId=1&warehouseId=18&origin=H%C3%A0%20N%E1%BB%99i
  }
  getListImportId(id: number){
    return this.baseApiService.getMethod(`ImportProductDetail/GetAllImportProductDetailByImportId?importId=${id}`,{});
  }
  updateImportProductDetail(ownerId:number, importId:number,data:any){
    return this.baseApiService.putMethod(`ImportProductDetail/UpdateImportProductDetail?ownerId=${ownerId}&importId=${importId}`,data)

  }
}
