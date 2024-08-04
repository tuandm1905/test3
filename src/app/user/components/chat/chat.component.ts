import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Output() close = new EventEmitter<void>();

  searchQuery: string = '';
  chatItems = [
    { name: 'Ngọc Trân', message: 'Bạn: hoviloooooo · 18 phút', img: 'assets/profile1.jpg' },
    { name: 'Minh', message: 'Bạn: hello · 10 phút', img: 'assets/profile2.jpg' },
    { name: 'Anh', message: 'Bạn: hi there · 5 phút', img: 'assets/profile3.jpg' },
  ];
  filteredChatItems = this.chatItems;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.chat-popup') && !target.closest('.messenger-icon')) {
      this.closeChat();
    }
  }

  closeChat() {
    this.close.emit();
  }

  onSearchChange() {
    this.filteredChatItems = this.chatItems.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }
}
