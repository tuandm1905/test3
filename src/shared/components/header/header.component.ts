import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen = false;
  items: any[] | undefined;
  isChatVisible = false;

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectedItem: any;
  suggestions: any[] = [];

  search(event: any) {
    const query = event.query;
    this.suggestions = this.filterSuggestions(query);
  }

  filterSuggestions(query: string): any[] {
    const items = ['Item1', 'Item2', 'Item3'];
    return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  }

  hideChat() {
    this.isChatVisible = false;
  }
}
