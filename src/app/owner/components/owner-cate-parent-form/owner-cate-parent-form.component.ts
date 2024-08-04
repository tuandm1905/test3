import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-cate-parent-form',
  templateUrl: './owner-cate-parent-form.component.html',
  styleUrl: './owner-cate-parent-form.component.scss'
})
export class OwnerCateParentFormComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	isBans = [
		{
			id: true,
			name: "Delete"
		},
		{
			id: false,
			name: "Active"
		}
	]

	form = new FormGroup({
		Name : new FormControl(null, Validators.required),
		Image: new FormControl(null, Validators.required),
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
		console.log(this.isVisible);
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}
		
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Name: this.data?.name,
				Image: this.data?.image
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
	}
	submit() {

		if (this.form.invalid) {

			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.cateParentId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}