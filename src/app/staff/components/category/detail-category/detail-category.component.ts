import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detail-category',
  templateUrl: './detail-category.component.html',
  styleUrls: ['./detail-category.component.scss']
})
export class DetailCategoryComponent {
  @Input() category: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();


  closeModal() {
    this.close.emit();
  }
}
