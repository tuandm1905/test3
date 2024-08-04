import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
// export class ProductItemComponent {
//   showReviews: boolean = false;

//   toggleReviews() {
//     this.showReviews = !this.showReviews;
//   }
//   addToCart() {
//     console.log('Product added to cart');
//   }

//   findInStore() {
//     console.log('Finding product in store');
//   }
// }
export class ProductItemComponent implements OnInit {

  productId!: number;
  showReviews: boolean = false;

  toggleReviews() {
    this.showReviews = !this.showReviews;
  }
  addToCart() {
    console.log('Product added to cart');
  }

  findInStore() {
    console.log('Finding product in store');
  }
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    // Fetch product details using this.productId
  }
}
