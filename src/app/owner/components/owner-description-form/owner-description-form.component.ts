import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AlertService } from '../../helpers/alert.service';
import { CommonService } from '../../helpers/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloudinaryConfig } from '../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-owner-description-form',
    templateUrl: './owner-description-form.component.html',
    styleUrls: ['./owner-description-form.component.scss']
})
export class OwnerDescriptionFormComponent {
    @Input() data: any;
    @Input() typeForm: any;
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
            ImageLinks: new FormControl('', Validators.required),
        });
    }

    ngOnChanges(): void {
		console.log('data',this.data)
		console.log('data',this.typeForm)
        if (!this.isVisible) {
            this.form.reset();
            this.form.enable();
        }

        if (this.data && this.typeForm !== 1) {
            this.form.patchValue({
                Title: this.data?.title || '',
                Content: this.data?.content || '',
                ImageLinks: this.data?.images[0]?.linkImage || ''
            });

            if (this.typeForm === 2) {
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
                this.form.patchValue({ ImageLinks: this.image });
                if (this.data) {
                    this.data.imageLinks = this.image;
                }
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
            id: this.data?.descriptionId
        });
    }

    closeModal() {
        this.form.reset();
        this.image = null;
        this.close.emit();
    }
}
