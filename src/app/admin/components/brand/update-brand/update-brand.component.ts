import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { HttpClient } from '@angular/common/http';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';

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
        Image: new FormControl(null as string | null, Validators.required)
    });
	@ViewChild('fileInput') fileInput!: ElementRef;
	selectedFile: File | null = null;
	image: string | null = null;  // Updated property name

	constructor(
        public commonService: CommonService,
        private alertService: AlertService,
		private http: HttpClient,

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
			});
		}
	}

	onFileSelected(event: any): void {
		const file = event.target.files[0];
		if (file) {
		  this.selectedFile = file;
		  const reader = new FileReader();
		  reader.onload = (e: any) => {
			this.image = e.target.result;
		  };
		  reader.readAsDataURL(file);
		} else {
		  this.selectedFile = null;
		  this.image = null;
		}
	  }
	
	  uploadImage(folderName: string): void {
		if (!this.selectedFile) return;
		const formData = new FormData();
		formData.append('file', this.selectedFile);
		formData.append('upload_preset', cloudinaryConfig.upload_preset);
		formData.append('folder', folderName);
	
		this.http.post(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`, formData)
		  .subscribe((response: any) => {
			this.image = response.secure_url;
			this.form.patchValue({ Image: this.image as string | null });
			this.selectedFile = null;
		  }, error => {
			this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
		  });
	  }
	
	  saveData() {
		if (this.form.invalid) {
		  this.alertService.fireSmall('error', "Form Category is invalid");
		  return;
		}
	
		// if (!this.image) {
		//   this.alertService.fireSmall('error', "Please select and upload an image before saving.");
		//   return;
		// }
	
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
