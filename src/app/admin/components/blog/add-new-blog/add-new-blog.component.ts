import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-blog',
  templateUrl: './add-new-blog.component.html',
  styleUrls: ['./add-new-blog.component.scss']
})
export class AddNewBlogComponent {
  @Input() blog: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveBlog() {
    this.save.emit(this.blog);
  }

  closeModal() {
    this.close.emit();
  }
}
