import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';

@Component({
	selector: 'app-update-account',
	templateUrl: './update-account.component.html',
	styleUrl: './update-account.component.scss'
})
export class UpdateAccountComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	@Input() categories: any;
	@Input() brands: any;
	@Input() owners: any;

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

	form: any = new FormGroup({
		email: new FormControl(null, Validators.required),
		password: new FormControl(null),
		fullname: new FormControl(null, Validators.required),
		image: new FormControl(null),
		phone: new FormControl(null, Validators.required),
		address: new FormControl(null),
		gender: new FormControl(null, Validators.required),
		dob: new FormControl(null),
		isBan: new FormControl(null),
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
				email: this.data?.email,
				fullname: this.data?.fullname,
				image: this.data?.image,
				gender: this.data?.gender,
				dob: this.data?.dob ? moment(this.data.dob).format('yyyy-MM-dd') : null,
				phone: this.data?.phone,
				address: this.data?.address,
				isBan: this.data?.isBan,
			});
			if(this.typeForm == 2) {
				this.form.disable();
			}
			this.form.get('password')?.clearValidators();
			this.form.get('password')?.updateValueAndValidity();
		}
		if(this.typeForm == 1) {
			this.form.get('password')?.setValidators(Validators.required);
			this.form.get('password')?.updateValueAndValidity();
		} else {
			this.form.get('password')?.clearValidators();
			this.form.get('password')?.updateValueAndValidity();
		}
	}
	submit() {
		if (this.form.invalid) {
			console.log(this.form);
			this.alertService.fireSmall('error', "Form account is invalid");
			return;
		}
		let dataBody = this.form.value;
		if(this.data?.accountId) {
			delete dataBody.password
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.accountId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
