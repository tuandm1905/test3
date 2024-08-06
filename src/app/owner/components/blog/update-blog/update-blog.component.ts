import { Component, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';

@Component({
	selector: 'app-update-blog',
	templateUrl: './update-blog.component.html',
	styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent implements OnChanges {
	@Input() data: any;
	@Input() owners: any;
	@Input() services: any[] = [];
	@Input() typeForm: number = 0;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form: FormGroup;
    @ViewChild('fileInput') fileInput!: ElementRef;
    selectedFile: File | null = null;
    image: string | null = null;

	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private http: HttpClient,
	) {
		this.form = new FormGroup({
			Title: new FormControl('', Validators.required),
			Content: new FormControl('', Validators.required),
			Image: new FormControl('', Validators.required),
			ServiceId: new FormControl('', Validators.required),
			StatusPostId: new FormControl('', Validators.required),
			OwnerId: new FormControl('', Validators.required),
		});
	}

	ngOnChanges(): void {
		console.log('owners', Number(this.owners))
		console.log('Services:', this.services); // Debug: Kiểm tra dữ liệu services
		console.log('data', this.data);
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		} else if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Title: this.data.title,
				Content: this.data.content,
				Image: this.data.image || '',
				ServiceId: this.data.serviceId,
				StatusPostId: this.data.statusPostId || null,
				OwnerId: this.data.ownerId
			});

			if (this.typeForm == 2) {
				this.form.disable();
			}
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
                this.form.patchValue({ Image: this.image });
                if (this.data) {
                    this.data.imageLinks = this.image;
                }
                this.selectedFile = null;
            }, error => {
                this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
            });
    }

	submit() {
		console.log('Form Value:', this.form.value);
		this.save.emit({

			form: this.form.value,
			id: this.data?.adId
		});
	}
	closeModal() {
		this.form.reset();
		this.image = null;
		this.close.emit();
	}
}
