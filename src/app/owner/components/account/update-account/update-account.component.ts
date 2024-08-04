import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';

@Component({
	selector: 'app-update-account',
	templateUrl: './update-account.component.html',
	styleUrl: './update-account.component.scss'
})
export class UpdateAccountComponent {
	@Input() account: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form = new FormGroup({
		staffId: new FormControl(0, Validators.required),
		email: new FormControl(null, Validators.required),
		password: new FormControl(null, Validators.required),
		fullname: new FormControl(null, Validators.required),
		image: new FormControl(null as string | null, Validators.required),
		phone: new FormControl(null, Validators.required),
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
		
		console.log('NgOnChanges account:', this.isVisible, this.typeForm, this.account);
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		} else {
			
		}
		if(this.typeForm == 1) {
			this.form.get('password')?.setValidators(Validators.required);
			this.form.get('password')?.updateValueAndValidity();
		} else {
			this.form.get('password')?.clearValidators();
			this.form.get('password')?.updateValueAndValidity();
		}

		if (this.account && this.typeForm != 1) {
			this.form.patchValue({
				staffId: this.account?.staffId,
				email: this.account?.email,
				fullname: this.account?.fullname,
				image: this.account?.image,
				phone: this.account?.phone,
			});
			if(this.typeForm == 2) {
				this.form.disable();
			}
			this.form.get('password')?.clearValidators();
			this.form.get('password')?.updateValueAndValidity();
			
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
			this.form.patchValue({ image: this.image as string | null });
			this.selectedFile = null;
		  }, error => {
			this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
		  });
	  }
	submit() {
		if (this.form.invalid) {
			console.log('data staff chinh sửa',this.image);
			this.alertService.fireSmall('error', "Form Product is invalid");
			return;
		}
		// let dataBody = this.form.value;
		// if(this.account?.accountId) {
		// 	delete dataBody.password
		// }
		this.save.emit({
			form: this.form.value,
			id: this.account?.accountId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
