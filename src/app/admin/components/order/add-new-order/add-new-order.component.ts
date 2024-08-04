import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-order',
  templateUrl: './add-new-order.component.html',
  styleUrls: ['./add-new-order.component.scss']
})
export class AddNewOrderComponent {
  @Input() order: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveOrder() {
    this.save.emit(this.order);
  }

  closeModal() {
    this.close.emit();
  }
}
