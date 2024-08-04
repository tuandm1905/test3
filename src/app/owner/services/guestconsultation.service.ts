import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class GuestconsultationService {


	constructor(
		private baseApiService: BaseApiService
	) { }
	getLists(params: any) {
		const { searchQuery, page, pageSize, ownerId } = params;
		return this.baseApiService.getMethod('GuestConsultation/GetAllGuestConsultations', { searchQuery, page, pageSize, ownerId });
	}
	getListswaiting(params: any) {
		const { searchQuery, page, pageSize, ownerId } = params;
		return this.baseApiService.getMethod('GuestConsultation/GetAllGuestConsultationsWaiting', { searchQuery, page, pageSize, ownerId });
	}
	getListsaccept(params: any) {
		const { searchQuery, page, pageSize, ownerId } = params;
		return this.baseApiService.getMethod('GuestConsultation/GetAllGuestConsultationsAccept', { searchQuery, page, pageSize, ownerId });
	}
	getListsdeny(params: any) {
		const { searchQuery, page, pageSize, ownerId } = params;
		return this.baseApiService.getMethod('GuestConsultation/GetAllGuestConsultationsDeny', { searchQuery, page, pageSize, ownerId });
	}

	show(id: any) {
		return this.baseApiService.getMethod(`GuestConsultation/GetGuestConsultationsById/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			return this.baseApiService.putMethod(`Account/${id}`, params, true);
		}
		return this.baseApiService.postMethod('Account', params, true);
	}

	updateStatus(guestId: number, statusGuestId: string) {
		const url = `GuestConsultation/UpdateStatusGuestConsultationt?guestId=${guestId}&statusGuest=${statusGuestId}`;
		return this.baseApiService.putMethod(url,{});
	}
}
