import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  constructor(private router: Router) { }

  goToDetails() {
    this.router.navigate(['/order-details']);
  }
}
