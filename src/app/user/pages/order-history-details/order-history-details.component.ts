import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.scss']
})
export class OrderHistoryDetailsComponent {
  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
