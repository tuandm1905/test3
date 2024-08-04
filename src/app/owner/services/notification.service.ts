import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private baseApiService: BaseApiService
  ) { }
  noti(id: any) {
		return this.baseApiService.getMethod(`Notification/owner/${id}`, {});
	}
  status(id: any) {
		return this.baseApiService.putMethod(`Notification/owner/${id}`, {});
	}
  

}
