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
	@Input() services: any[] = [];
	@Input() typeForm: number = 0;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();
	form: FormGroup;
	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) {
		this.form = new FormGroup({
			Title: new FormControl('', Validators.required),
			Content: new FormControl('', Validators.required),
			Image: new FormControl('', [Validators.required, Validators.min(0.01)]),
			ServiceId: new FormControl('', Validators.required),
			StatusPostId: new FormControl('', Validators.required),
			OwnerId: new FormControl('', Validators.required),
		});
	}

	ngOnChanges(): void {
		console.log('owners', Number(this.owners))
		console.log('Services:', this.services); // Debug: Kiểm tra dữ liệu services
		console.log('data', this.data);
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		} else if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Title: this.data.title,
				Content: this.data.content,
				Image: this.data.image || '',
				ServiceId: this.data.serviceId,
				StatusPostId: this.data.statusPostId || null,
				OwnerId: this.data.ownerId
			});

			if (this.typeForm == 2) {
				this.form.disable();
			}
		}
	}


	submit() {
		console.log('Form Value:', this.form.value);
		this.save.emit({

			form: this.form.value,
			id: this.data?.adId
		});


	}


	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}
