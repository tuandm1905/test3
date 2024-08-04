import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertService } from '../../helpers/alert.service';
import { CommonService } from '../../helpers/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-size-form',
  templateUrl: './owner-size-form.component.html',
  styleUrl: './owner-size-form.component.scss'
})
export class OwnerSizeFormComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form = new FormGroup({
		name : new FormControl(null, Validators.required),
	});

	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) {

	}

	ngOnChanges(): void {
		this.form.reset();
		console.log('form',this.form.invalid);
		console.log(this.isVisible);
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}
		
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				name: this.data?.name,
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
	}
	submit() {
		console.log('form',this.form.invalid);
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
