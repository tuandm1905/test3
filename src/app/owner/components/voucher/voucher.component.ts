import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';

@Component({
	selector: 'app-voucher-form',
	templateUrl: './voucher.component.html',
	styleUrl: './voucher.component.scss'
})
export class VoucherComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() owners: any;
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

	form: any = new FormGroup({
		voucherId: new FormControl(null, Validators.required),
		price: new FormControl(null, Validators.required),
		quantity: new FormControl(null, Validators.required),
		startDate: new FormControl(null, Validators.required),
		endDate: new FormControl(null, Validators.required),
		quantityUsed: new FormControl(null),
		ownerId: new FormControl(null),
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
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}

		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				voucherId: this.data?.voucherId,
				price: this.data?.price,
				quantity: this.data?.quantity,
				startDate: moment(this.data?.startDate).format('YYYY-MM-DDTHH:mm'),
				endDate: moment(this.data?.endDate).format('YYYY-MM-DDTHH:mm'),
				quantityUsed: this.data?.quantityUsed,
				ownerId: this.data?.ownerId,
				isdelete: this.data?.isdelete,
			});

			if (this.typeForm == 2) {
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
			id: this.data?.voucherId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
