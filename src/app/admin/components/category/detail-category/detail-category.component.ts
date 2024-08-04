import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';

@Component({
	selector: 'app-detail-category',
	templateUrl: './detail-category.component.html',
	styleUrls: ['./detail-category.component.scss']
})
export class DetailCategoryComponent {
	@Input() categoryParents: any = [];
	@Input() category: any = {};
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() close = new EventEmitter<void>();

	parent: any

	form = new FormGroup({
		Name: new FormControl(null, Validators.required),
		Image: new FormControl(null, Validators.required),
		Parent: new FormControl(null)
	  });
	  
	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) { }
	ngOnChanges(): void {
		if (!this.isVisible) {
		  this.form.reset();
		}
		console.log('Category:', this.category);
		console.log('Category Parent:', this.category?.parent);
		console.log('Form Value:', this.form.value);
		console.log('Category Parents:', this.categoryParents);
		if (this.category) {
		  this.form.patchValue({
			Name: this.category?.name,
			Image: this.category?.image,
			 Parent: this.category?.cateParent?.name || ''
		  });
		  this.form.disable();
		}
		
	  }

	  closeModal() {
		this.form.reset();
		this.close.emit();
	  }
}
