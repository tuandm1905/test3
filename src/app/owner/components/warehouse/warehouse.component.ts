import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-warehouse-form',
	templateUrl: './warehouse.component.html',
	styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {
	@Input() data: any;
	@Input() modalTitle: string = '';
	@Input() typeForm: any;
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) { }

	form = new FormGroup({
		ProductSize: new FormControl(null, Validators.required),
		Location: new FormControl(null, Validators.required),
	});
	ngOnInit(): void {
		console.log('data',this.data);
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}
		console.log('typeform',this.typeForm);
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				ProductSize: this.data?.productSizeId,
				Location: this.data?.location,
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
		console.log('data',this.form);
	}

	

	submit() {
		console.log('form', this.form.invalid);
		if (!this.form.invalid) {

			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.warehouseId
		});
	}
	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}

