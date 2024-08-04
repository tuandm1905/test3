import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AlertService } from '../../helpers/alert.service';
import { CommonService } from '../../helpers/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloudinaryConfig } from '../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-owner-description-form',
	templateUrl: './owner-description-form.component.html',
	styleUrl: './owner-description-form.component.scss'
})
export class OwnerDescriptionFormComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form = new FormGroup({
		Title: new FormControl(null, Validators.required),
		Content: new FormControl(null, Validators.required),
		ImageLinks: new FormControl(null as string | null, Validators.required),
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
		console.log('ngOnChanges called');
        console.log('data', this.data);
        console.log('typeForm', this.typeForm);
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}
		console.log('typeform', this.typeForm);
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Title: this.data?.title,
				Content: this.data?.content,
				ImageLinks: this.data?.imageLinks
			});
			
			console.log('Patched form values:', this.form.value);
			if (this.typeForm == 2) {
				this.form.disable();
			}
		}
	
	}
	onFileSelected(event: any): void {
		const file = event.target.files[0];
		if (file) {
		  this.selectedFile = file;
		  console.log('Selected file:', this.selectedFile);
		  const reader = new FileReader();
		  reader.onload = (e: any) => {
			this.image = e.target.result;
			console.log('Loaded image:', this.image);
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
			console.log('Uploaded image URL:', this.image);
			this.form.patchValue({ ImageLinks: this.image as string | null });
			console.log('Form after image upload:', this.form.value);
			if (this.data) {
				this.data.imageLinks = this.image;
			}
			this.selectedFile = null;
		  }, error => {
			this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
		  });
	  }
	
	submit() {
		console.log('submit called');
        console.log('Form validity:', this.form.invalid);
		console.log('Form validity:', this.form);
		if (this.form.invalid) {

			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		// if (this.data) {
		// 	this.data = this.form.value;
        //     this.data.title = this.form.value.title;
        //     this.data.content = this.form.value.content;
        //     this.data.imageLinks = this.form.value.linkImage;
        // }
		console.log('Form values before emit:', this.form.value);
        console.log('DescriptionId:', this.data?.descriptionId);
		this.save.emit({
			form: this.form.value,
			id: this.data?.descriptionId
		});
	}

	closeModal() {
		console.log('closeModal called');
        console.log('Form values before reset:', this.form.value);
        console.log('Image before reset:', this.image);

		this.form.reset();
		this.image = null;
		this.close.emit();
	}
}
