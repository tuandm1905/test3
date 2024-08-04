import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-update-blog',
	templateUrl: './update-blog.component.html',
	styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent implements OnChanges {
	@Input() data: any;
	@Input() owners: any;
	@Input() services: any;
	@Input() typeForm: number = 0;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	statusPost = [
		{ id: 1, name: "Active" },
		{ id: 2, name: "Inactive" }
	];

	form: FormGroup = new FormGroup({
		Title: new FormControl(null, Validators.required),
		Content: new FormControl(null, Validators.required),
		Image: new FormControl(null, Validators.required),
		ServiceId: new FormControl(null, Validators.required),
		StatusPostId: new FormControl(1, Validators.required),
		OwnerId: new FormControl(null, Validators.required)
	});


	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) { }

	ngOnChanges(): void {
		console.log('Services:', this.services); // Debug: Kiểm tra dữ liệu services
		this.form.reset();
		if (this.data && this.typeForm !== 1) {
			this.form.patchValue({
				Title: this.data?.title || '',
				Content: this.data?.content || '',
				Image: this.data?.image || '',
				ServiceId: this.data?.serviceId || null,
				StatusPostId: this.data?.statusPostId || 1,
				OwnerId: this.data?.ownerId || null
			});

			if (this.typeForm === 2) { // View mode
				this.form.disable();
			} else { // Edit mode
				this.form.enable();
			}
		} else { // Create mode
			this.form.enable();
			this.form.reset({
				StatusPostId: 1
			});
		}
	}


	submit() {
		console.log('Form Value:', this.form.value); // Debug: Kiểm tra giá trị form trước khi submit
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		const formData = { ...this.form.value, AdId: this.data?.adId };
		this.save.emit(formData);
	}


	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}
