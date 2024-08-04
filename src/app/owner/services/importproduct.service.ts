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
  create(warehouseId: number, origin: string){
    return this.baseApiService.postMethod(`ImportProduct/CreateImportProduct?warehouseId=${warehouseId}&origin=${origin}`,{})
  }
}
