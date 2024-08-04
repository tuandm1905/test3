import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss']
})
export class UpdateOrderComponent {
  @Input() order: any;
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  handleClose() {
    this.close.emit();
  }

  handleSave() {
    this.save.emit(this.order);
  }
}
