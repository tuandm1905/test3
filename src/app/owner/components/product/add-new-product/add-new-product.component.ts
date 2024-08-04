import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';

@Component({
	selector: 'app-add-new-product',
	templateUrl: './add-new-product.component.html',
	styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent {
	@Input() product: any = {};
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Input() categories: any[] = [];
	@Input() brands: any[] = [];
	@Input() owners: any[] = [];
	@Input() descriptions: any[] = [];
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();
	@Output() updateSuccess = new EventEmitter<void>(); // Emit an event on successful update

	@ViewChild('fileInput') fileInput!: ElementRef;
	selectedFiles: File[] = [];
	form = new FormGroup({
		Name: new FormControl('', Validators.required),
		ShortDescription: new FormControl('', Validators.required),
		Price: new FormControl('', [Validators.required, Validators.min(0.01)]),
		DescriptionId: new FormControl('', Validators.required),
		CategoryId: new FormControl('', Validators.required),
		BrandId: new FormControl(''),
		OwnerId: new FormControl(null),
	});;
	config: any;
	formErrors: any = {}; // Để lưu lỗi từ phản hồi API
	originalImages: { linkImage: string, name: string, imageId?: string }[] = [];
	newImages: { linkImage: string, name: string }[] = [];
	removedImages: { linkImage: string, name: string, imageId?: string }[] = [];

	constructor(private http: HttpClient,
		private productService: ProductService,
		private alertService: AlertService,
	) {

		this.config = {
			placeholder: 'Enter content here',
			tabsize: 2,
			height: '200px',
			toolbar: [
				['misc', ['codeview', 'undo', 'redo']],
				['style', ['bold', 'italic', 'underline', 'clear']],
				['font', ['strikethrough', 'superscript', 'subscript']],
				['fontsize', ['fontname', 'fontsize', 'color']],
				['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
				['insert', ['table', 'picture', 'link', 'video', 'hr']]
			],
			fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
		};
		
	}

	ngOnChanges(): void {
		let userStorage = localStorage.getItem('user');
		let user = null;
		if(userStorage) user = JSON.parse(userStorage);
		if (!this.isVisible) {
			this.form.reset();
			this.form.patchValue({
				OwnerId: user?.id
			})
		} else {
			this.form.patchValue({
				OwnerId: user?.id
			})
		}
	}

	onFilesSelected(event: any): void {
		const files: FileList = event.target.files;
		const newImages: { linkImage: string, name: string }[] = [];

		// Promise.all để chờ tất cả các FileReader hoàn thành
		const fileReaders = Array.from(files).map((file: File) => {
			return new Promise<{ linkImage: string, name: string }>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e: any) => {
					resolve({ linkImage: e.target.result, name: file.name });
				};
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		});

		// Chờ tất cả các Promise hoàn thành
		Promise.all(fileReaders).then(results => {
			this.newImages = [...this.newImages, ...results];
			console.log('Updated new images list:', this.newImages); // danh sách ảnh mới được chọn từ máy
		}).catch(error => {
			console.error('Error reading files:', error);
		});
	}


	removeImage(index: number): void {
		const image = this.originalImages[index];
		this.removedImages.push(image);
		this.originalImages.splice(index, 1);
		console.log('Image removed, remaining images:', this.originalImages); // danh sách còn lại// xài cái này
		console.log('Removed images:', this.removedImages); // danh sách bị xóa của ảnh cũ
	}
	removeNewImage(index: number): void {
		this.newImages.splice(index, 1);
		console.log('New image removed, remaining new images:', this.newImages); // danh sách còn lại khi bị xóa// xài cái này
	}

	removeFile(index: number): void {
		this.selectedFiles.splice(index, 1);
		console.log('File removed, remaining files:', this.selectedFiles);
	}

	async uploadImage(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', cloudinaryConfig.upload_preset);
		formData.append('folder', 'products');

		try {
			const response = await this.http.post<any>(
				`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
				formData
			).toPromise();
			console.log('Uploaded image URL:', response.secure_url);
			return response.secure_url;
		} catch (error) {
			console.error('Failed to upload image', error);
			throw error;
		}
	}

	async submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			console.log('Form is invalid:', this.form);
			return;
		}

		try {
			// Convert base64 images to File objects and upload them
			const newImageFiles = this.newImages.map(image => this.base64ToFile(image.linkImage, image.name));
			const newImageUrls = await Promise.all(newImageFiles.map(file => this.uploadImage(file)));

			// Filter out removed images and combine with new image URLs
			const remainingOriginalImageUrls = this.originalImages
				.filter(image => !this.removedImages.some(removed => removed.linkImage === image.linkImage))
				.map(image => image.linkImage);

			const allImageUrls = [...remainingOriginalImageUrls, ...newImageUrls];

			// Update product with the combined image URLs
			await this.updateProduct(allImageUrls);
		} catch (error) {
			console.error('Error during image upload and product update', error);
		}
	}


	// Convert a base64 string to a File object
	base64ToFile(base64: string, filename: string): File {
		const arr = base64.split(',');
		const mimeMatch = arr[0].match(/:(.*?);/);

		if (!mimeMatch) {
			throw new Error('Invalid base64 data'); // Handle the error as needed
		}

		const mime = mimeMatch[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	}



	async updateProduct(imageUrls: string[]) {
		let body: any = {
			...this.form.value,
		};


		imageUrls.forEach((link: any, index) => {
			
			body[`ImageLinks[${index}]`] = link
		});
		this.productService.createOrUpdateData(body, this.product?.productId).subscribe((res: any) => {
			if (res?.message.includes('successfully')) {
				this.alertService.fireSmall('success', res?.message);
				this.closeModal();
			} else if (res?.errors) {
				this.alertService.showListError(res?.errors);
			} else {
				this.alertService.fireSmall('error', res?.message || "Updated Product failed!");
			}
		});

	// 	imageUrls.forEach((link, index) => {
	// 	formData.append(`ImageLinks[${index}]`, link);
	//   });
  
	//   console.log('Form data being sent to API:', formData);
	//   this.productService.UpdateData(formData, this.product.productId).subscribe((res: any) => {
	// 	if (res?.message.includes('successfully')) {
	// 	  this.alertService.fireSmall('success', res?.message);
	// 	  this.closeModal();
	// 	} else if (res?.errors) {
	// 	  this.alertService.showListError(res?.errors);
	// 	} else {
	// 	  this.alertService.fireSmall('error', res?.message || "Updated Product failed!");
	// 	}
	//   });
	}

	closeModal() {
		this.close.emit();
		this.form.reset();
		this.selectedFiles = [];
		this.formErrors = {};
		this.originalImages = [];
		this.newImages = [];
		this.removedImages = [];
		console.log('Modal closed and form reset.');
	}
}
