import { Component } from '@angular/core';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { ChatService } from '../../services/chat.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Message {
  content: string;
  senderType: string;
  senderId: number;
  timestamp: string;
  roomId: number;
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  breadCrumb: any = [
    { label: 'Owner', link: '/' },
    { label: 'Order', link: '/owner/chat' }
  ];

  messageContent: string = '';
  dataList: any = [];
  loading = false;
  paging: any = { ...INIT_PAGING };
  ownerId: number | null = null;
  selectedPerson: any = null;
  userType: string = '';

  form = new FormGroup({
    content: new FormControl<string | null>(null, Validators.required),
    senderType: new FormControl<string | null>(null, Validators.required),
    senderId: new FormControl<number | null>(null, Validators.required),
    timestamp: new FormControl<string | null>(null, Validators.required),
    roomId: new FormControl<number | null>(null, Validators.required),
  });

  constructor(
    private chatService: ChatService,
    private alertService: AlertService,
    private authenService: AuthenService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    this.ownerId = user?.id ?? null;
    if (this.userType == 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        console.log('ID của Owner', this.ownerId);
        if (this.userType === 'Owner' || this.userType === 'Staff') {
          this.loadRooms(this.ownerId);
        }
      });
    } else {
      this.loadRooms(this.ownerId);
    }
  }

  dataListAll: any;
  loadRooms(id: any) {
    this.loading = true;
    this.chatService.getRooms(id).subscribe((res: any) => {
      this.loading = false;
      this.dataListAll = res?.data || [];
      console.log('dataAll', this.dataListAll);
    });
  }

  dataListRoom: any;
  selectPerson(room: number): void {
    console.log('room', room);
    this.selectedPerson = this.dataListAll.find((c: any) => c.roomId === room);
    this.chatService.getMessages(room).subscribe((res: any) => {
      this.dataListRoom = res?.data;
      console.log('dataAll room', this.dataListRoom);
    });
  }

  sendMessage(): void {
    if (this.messageContent.trim() && this.selectedPerson) {
      const currentUser = this.authenService.getUser();
      const currentTimestamp = new Date().toISOString();

      this.form.setValue({
        content: this.messageContent,
        senderType: this.userType === 'Owner' ? 'Owner' : 'Staff',
        senderId: currentUser.id, // Make sure this is the correct property for user ID
        timestamp: currentTimestamp,
        roomId: this.selectedPerson.roomId
      });

      this.dataListRoom.push(this.form.value);

      this.messageContent = '';

      this.chatService.sendMessage(this.form.value).subscribe(() => {
        console.log('Message sent');
      }, error => {
        console.error('Error sending message:', error);
      });
    }
  }
}
