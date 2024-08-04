import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

	form = new FormGroup({
		ownerId: new FormControl(0, Validators.required),
		email: new FormControl(null, Validators.required),
		password: new FormControl(null, Validators.required),
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
		}
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				ownerId: this.data?.ownerId,
				email: this.data?.email,
				fullname: this.data?.fullname,
				image: this.data?.image,
				phone: this.data?.phone,
				address: this.data?.address,
				isBan: this.data?.isBan,
			});
			console.log(this.typeForm);
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
	}
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Product is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.brandId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
