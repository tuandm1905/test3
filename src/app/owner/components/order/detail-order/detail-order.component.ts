import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent {
  @Input() order: any;
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  orderDetails: any[];
  form = new FormGroup({
    orderId: new FormControl(null, Validators.required),
    codeOrder: new FormControl(null, Validators.required),
    fullName: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    orderDate: new FormControl(null, Validators.required),
    requiredDate: new FormControl(null, Validators.required),
    shippedDate: new FormControl(null),
    quantity: new FormControl(null, Validators.required),
    totalPrice: new FormControl(null, Validators.required),
    statusId: new FormControl(null, Validators.required),
    statusName: new FormControl(null, Validators.required),
  });
  constructor(
		public commonService: CommonService,
		private alertService: AlertService,
    private orderDetailService: OrderService
	) {

	}
    ngOnChanges(): void {
    this.form.reset();
    if (this.order) {
      console.log('data order ben component',this.order)
      this.form.patchValue({
        codeOrder: this.order?.codeOrder,
        fullName: this.order?.fullName,
        address: this.order?.address,
        orderDate: this.order?.orderDate,
        requiredDate: this.order?.requiredDate,
        shippedDate: this.order?.shippedDate,
        quantity: this.order?.quantity,
        totalPrice: this.order?.totalPrice,
        statusId: this.order?.statusId,
        statusName: this.order?.statusName,
      });
      this.form.disable(); // Disable form if view mode
    }
  }
  fetchOrderDetails() {
    this.orderDetailService.detail(this.order.orderId).subscribe(
      data => {
        this.order = data;
        this.orderDetails = data.orderItems;
        this.orderDetails.forEach(item => {
          // this.productUserRate[item.productId] = item.userRate;
        });
        // this.showReviewSection = this.orderDetails.some(item => item.userRate === 0);
      },
      error => {
        console.error('Error fetching order details:', error);
        // this.errorMessage = 'Could not fetch order details. Please try again later.';
      }
    );
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }
  getMerchandiseSubtotal(): number {
    if (!this.orderDetails) return 0;
    return this.orderDetails.reduce((total, item) => total + (item.quantity * item.price), 0);
  }
 

  closeModal() {
    this.close.emit();
  }
}
