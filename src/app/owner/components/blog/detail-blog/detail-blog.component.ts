import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-blog',
  templateUrl: './detail-blog.component.html',
  styleUrls: ['./detail-blog.component.scss']
})
export class DetailBlogComponent {
  @Input() blog: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();


  form = new FormGroup({
		Title: new FormControl(null, Validators.required),
		Content: new FormControl(null, Validators.required),
		Image: new FormControl(null as string | null, Validators.required),
		Service: new FormControl(null, Validators.required),
		StatusPostId: new FormControl(1, Validators.required),
		OwnerId: new FormControl(null, Validators.required)
	});

  @ViewChild('fileInput') fileInput!: ElementRef;
	selectedFile: File | null = null;
	image: string | null = null;  // Updated property name
	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private http: HttpClient,
	) {

	}
  closeModal() {
    this.close.emit();
  }
}
