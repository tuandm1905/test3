import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-admin',
  templateUrl: './service-admin.component.html',
  styleUrl: './service-admin.component.scss'
})
export class ServiceAdminComponent {
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
		serviceId: new FormControl(0),
		name: new FormControl(null, Validators.required),
		isdelete: new FormControl(false),
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
			this.form.reset();
			this.form.enable();
		}
		
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				serviceId: this.data?.serviceId,
				name: this.data?.name,
				isdelete: this.data?.isdelete
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
		console.log('form troc',this.form.invalid);
	}
	submit() {
		console.log('form',this.form.invalid);
		if (this.form.invalid) {

			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.serviceId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
