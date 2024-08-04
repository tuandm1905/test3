import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  products = [
    { id: 1, name: 'Nike Air Force 1 \'07 EasyOn', price: 'S$189', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/6218f8cc55984cfe92d1a96d0110ac7e_9366/Giay_Handball_Spezial_DJen_DB3021_01_standard.jpg' },
    { id: 2, name: 'Air Jordan 1 Low', price: 'S$189', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d44fa06fc83f4644b7e8acbc01160e1b_9366/Giay_NMD_R1_Primeblue_DJen_GZ9258_01_standard.jpg' },
    { id: 3, name: 'Nike Air Force 1 \'07', price: 'S$189', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/be267c0d2b55486f98beacfd01049bfc_9366/Giay_Forum_Low_trang_FY7978_01_standard.jpg' },
    { id: 4, name: 'Nike Air Force 1 \'07 Fresh', price: 'S$219', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/186872d7bb8445edaa5bf79de16759e6_9366/Giay_Samba_OG_trang_IE3437_01_standard.jpg' },
    { id: 5, name: 'Nike Air Force 1 \'07', price: 'S$205', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/caa08574a1fc456c8021219bd1edad5a_9366/HANDBALL_SPEZIAL_W_Be_IF6562_01_standard.jpg' },
    { id: 6, name: 'Air Jordan 1 Low', price: 'S$189', image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b0b6d4a107ad4e84b3baaf8700866f07_9366/Giay_Campus_00s_mau_xanh_la_H03472_01_standard.jpg' }
  ];

  sidebarVisible = true;  // Add this property
  sortDropdownVisible = false;  // Add this property

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  toggleSidebar(): void {  // Add this method
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleSortDropdown(): void {  // Add this method
    this.sortDropdownVisible = !this.sortDropdownVisible;
  }

  sortProducts(criteria: string): void {  // Add this method
    this.sortDropdownVisible = false;
    // Handle sorting logic based on the selected criteria
    console.log('Selected sort option:', criteria);
  }
}
