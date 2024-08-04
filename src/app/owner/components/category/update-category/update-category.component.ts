import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';

@Component({
	selector: 'app-update-category',
	templateUrl: './update-category.component.html',
	styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {
	@Input() category: any = null;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form = new FormGroup({
		Name: new FormControl(null, Validators.required),
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
		if(this.category) {
			this.form.patchValue({
				Name: this.category?.name,
				Image: this.category?.image,
			});
		}
		if(!this.isVisible) {
			this.form.reset();
		}
	}

	saveCategory() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Catetory is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.category?.categoryId
		});
	}

	closeModal() {
		this.form.reset();
		this.close.emit();
	}
	saveProduct() {
		this.save.emit(this.category);
	}


}
