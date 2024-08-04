import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSummernoteDirective } from 'ngx-summernote';

@Component({
	selector: 'app-add-new-product',
	templateUrl: './add-new-product.component.html',
	styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent {
	@Input() product: any = {};
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	@Input() categories: any;
	@Input() brands: any;
	@Input() owners: any;
	@Input() descriptions: any;

	@ViewChild(NgxSummernoteDirective) summernote: any;
	public config: any = {
		placeholder: 'Nội dung',
		tabsize: 2,
		height: '200px',
		// uploadImagePath: '/api/upload',
		toolbar: [
			['misc', ['codeview', 'undo', 'redo']],
			['style', ['bold', 'italic', 'underline', 'clear']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontsize', ['fontname', 'fontsize', 'color']],
			['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
			['insert', ['table', 'picture', 'link', 'video', 'hr']]
		],
		fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
	}


	form = new FormGroup({
		Name: new FormControl(null, Validators.required),
		ImageLinks: new FormControl(null, Validators.required),
		ShortDescription: new FormControl(null, Validators.required),
		Price: new FormControl(null, Validators.required),
		DescriptionId: new FormControl(null, Validators.required),
		BrandId: new FormControl(null, Validators.required),
		CategoryId: new FormControl(null, Validators.required),
		OwnerId: new FormControl(null, Validators.required),
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
		}
	}
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Product is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: null
		});
	}

	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}
