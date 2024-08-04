import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.scss'
})
export class OrderItemsComponent {
  constructor(private router: Router) { }

  goToDetails() {
    this.router.navigate(['/order-details']);
  }
}
