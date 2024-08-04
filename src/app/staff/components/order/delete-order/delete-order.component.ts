import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.scss']
})
export class DeleteOrderComponent {
  @Input() order: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() delete = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  confirmDelete() {
    this.delete.emit(this.order.id);
  }

  closeModal() {
    this.close.emit();
  }
}
