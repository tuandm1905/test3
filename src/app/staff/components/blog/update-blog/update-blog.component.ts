import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent {
	@Input() data: any;
	@Input() owners: any;
	@Input() services: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	statusPost = [
		{
			id: 1,
			name: "Active"
		},
		{
			id: 2,
			name: "Inactive"
		}
	]

	form = new FormGroup({
		Title: new FormControl(null, Validators.required),
		Content: new FormControl(null, Validators.required),
		Image: new FormControl(null),
		ServiceId: new FormControl(null, Validators.required),
		StatusPostId: new FormControl(1, Validators.required),
		OwnerId: new FormControl(null, Validators.required)
	});

	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) {

	}

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		this.form.reset();
		if (!this.isVisible) {
			this.form.enable();
		}
		
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Title: this.data?.title,
				Content: this.data?.content,
				Image: this.data?.image,
				ServiceId: this.data?.serviceId,
				StatusPostId: this.data?.statusPostId || 1,
				OwnerId: this.data?.ownerId
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		} else {
			console.log(1);
			this.form.reset();
		}
	}
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
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
