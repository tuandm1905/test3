import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';

@Component({
	selector: 'app-update-brand',
	templateUrl: './update-brand.component.html',
	styleUrls: ['./update-brand.component.scss']
})
export class UpdateBrandComponent {
	@Input() brand: any = {};
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	@Input() categories: any;

	form = new FormGroup({
        Name: new FormControl(null, Validators.required),
        Image: new FormControl(null, Validators.required),
        CategoryId: new FormControl(null, Validators.required),
    });

	constructor(
        public commonService: CommonService,
        private alertService: AlertService
    ) {

    }

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		if(!this.isVisible) {
			this.form.reset();
		}
		if(this.brand) {
			this.form.patchValue({
				Name: this.brand?.name,
				Image: this.brand?.image,
				CategoryId: this.brand?.categoryId,
			});
		}
	}
	saveBrand() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Brand is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.brand.brandId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
