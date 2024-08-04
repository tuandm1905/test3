import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.scss']
})
export class DeleteBrandComponent {
  @Input() brand: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() delete = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  confirmDelete() {
    this.delete.emit(this.brand.id);
  }

  closeModal() {
    this.close.emit();
  }
}
