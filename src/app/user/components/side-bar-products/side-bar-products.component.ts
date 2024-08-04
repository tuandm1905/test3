import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar-products',
  templateUrl: './side-bar-products.component.html',
  styleUrls: ['./side-bar-products.component.scss']
})
export class SideBarProductsComponent {
  showPriceOptions = false;
  showBrandOptions = false;
  showSizeOptions = false;
  // sidebarVisible = true;

  togglePriceOptions() {
    this.showPriceOptions = !this.showPriceOptions;
  }

  toggleBrandOptions() {
    this.showBrandOptions = !this.showBrandOptions;
  }

  toggleSizeOptions() {
    this.showSizeOptions = !this.showSizeOptions;
  }

  // toggleSidebar() {
  //   this.sidebarVisible = !this.sidebarVisible;  // Add this method
  // }
}
