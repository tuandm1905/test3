import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-profile',
  templateUrl: './sidebar-profile.component.html',
  styleUrl: './sidebar-profile.component.scss'
})
export class SidebarProfileComponent {
  activeMenu: string | null = null;

  constructor(private router: Router) { }

  toggleSubMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }
}
