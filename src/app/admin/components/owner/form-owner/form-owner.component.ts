import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-owner',
  templateUrl: './form-owner.component.html',
  styleUrl: './form-owner.component.scss'
})
export class FormOwnerComponent  {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	isBans = [
		{
			id: true,
			name: "Ban"
		},
		{
			id: false,
			name: "UnBan"
		}
	]

	form = new FormGroup({
		ownerId: new FormControl(0, Validators.required),
		email: new FormControl(null, Validators.required),
		password: new FormControl(null),
		fullname: new FormControl(null, Validators.required),
		image: new FormControl(null),
		phone: new FormControl(null, Validators.required),
		address: new FormControl(null),
		isBan: new FormControl(false, Validators.required),
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
			this.form.get('password')?.clearValidators();
			this.form.get('password')?.updateValueAndValidity()
		}
		
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				ownerId: this.data?.ownerId,
				email: this.data?.email,
				fullname: this.data?.fullname,
				image: this.data?.image,
				phone: this.data?.phone,
				address: this.data?.address,
				password: this.data?.password,
				isBan: this.data?.isBan,
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
		if(this.typeForm == 1) {
			this.form.get('password')?.addValidators(Validators.required);
			this.form.get('password')?.updateValueAndValidity()
		}
	}
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		console.log(this.form);
		this.save.emit({
			form: this.form.value,
			id: this.data?.ownerId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
