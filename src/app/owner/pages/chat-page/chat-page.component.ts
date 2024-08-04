import { Component } from '@angular/core';

interface Message {
  content: string;
  sender: 'user' | 'bot';
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
  selectedPerson: string | null = 'Voldemort';
  messageContent: string = '';
  messages: Message[] = [
    { content: "Hey, Father's Day is coming up..", sender: 'bot' },
    { content: "What are you getting.. Oh, oops sorry dude.", sender: 'bot' },
    { content: "Nah, it's cool.", sender: 'user' },
    { content: "Well you should get your Dad a cologne. Here smell it. Oh wait! ...", sender: 'user' }
  ];

  selectPerson(person: string) {
    this.selectedPerson = person;
    // Thay đổi tin nhắn cho người khác nếu cần thiết
    this.messages = [
      { content: "New conversation started with " + person, sender: 'bot' }
    ];
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      this.messages.push({ content: this.messageContent, sender: 'user' });
      this.messageContent = '';
      // Tự động trả lời từ bot (đơn giản)
      setTimeout(() => {
        this.messages.push({ content: "That's interesting!", sender: 'bot' });
      }, 1000);
    }
  }
}
