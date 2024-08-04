import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-update-blog',
	templateUrl: './update-blog.component.html',
	styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent {
	@Input() data: any;
	// @Input() owners: any;
	// @Input() services: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	statusPost = [
		{
			id: 1,
			name: "Watting"
		},
		{
			id: 2,
			name: "Accept"
		},
		{
			id: 3,
			name: "Deny"
		}
	];



	form = new FormGroup({
		Title: new FormControl(null, Validators.required),
		Content: new FormControl(null, Validators.required),
		Image: new FormControl(null as string | null, Validators.required),
		Service: new FormControl(null, Validators.required),
		StatusPostId: new FormControl(1, Validators.required),
		OwnerId: new FormControl(null, Validators.required)
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
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}
		console.log('data', this.data);
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Title: this.data?.title,
				Content: this.data?.content,
				Image: this.data?.image,
				Service: this.data?.serviceName,
				StatusPostId: this.data?.statusPostId || 1,
				OwnerId: this.data?.ownerName
			});


			if (this.typeForm == 2) {
				this.form.disable();
			}
		} else {
			this.form.reset()
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
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.adId
		});
	}

	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}
