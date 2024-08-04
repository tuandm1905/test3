import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.scss']
})
export class DeleteBlogComponent {
  @Input() blog: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() delete = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  confirmDelete() {
    this.delete.emit(this.blog.id);
  }

  closeModal() {
    this.close.emit();
  }
}
