import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private baseApiService: BaseApiService) { }
  getRooms(ownerId: number) {
		return this.baseApiService.getMethod(`Room/ViewOwnerHistoryChat?ownerId=${ownerId}`, {});
	}
  getMessages(roomId: number){
    return this.baseApiService.getMethod(`Message/ViewAllMessageByRoom?roomId=${roomId}`,{});
  }
  sendMessage(data: any){
    return this.baseApiService.postMethod(`Message/CreateMessage`,data,true);
  }
  
}
