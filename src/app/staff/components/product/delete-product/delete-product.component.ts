import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent {
  @Input() product: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() delete = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  confirmDelete() {
    this.delete.emit(this.product.id);
  }

  closeModal() {
    this.close.emit();
  }
}
