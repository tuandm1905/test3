import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { ProductService } from '../../../services/product.service';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-detail-product',
	templateUrl: './detail-product.component.html',
	styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent {
	@Input() product: any = {};
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() close = new EventEmitter<void>();
	@Input() categories: any;
	@Input() brands: any;
	@Input() owners: any;
	@Input() descriptions: any;

	isScrollable: boolean = false;
	productSizes: any[] = [];
	formattedDescription: string = '';
	commentCount: number = 0;
	showReviews: boolean = false;
	replyIndex: number | null = null; // To track which review is being replied to
	replyContent: string = ''; // To store the reply content
	comments: any[] = [];
	mainImageUrl: string = '';
	selectedSize: any;
	maxQuantity: number = 0;
	quantity: number = 1;

	@ViewChild(NgxSummernoteDirective) summernote: any;
	public config: any = {
		placeholder: 'Nội dung',
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
		private alertService: AlertService,
		private productService: ProductService,
	) { }

	ngOnChanges(): void {
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
		}
		if (this.product) {
			this.form.patchValue({
				Name: this.product?.name,
				ImageLinks: this.product?.images,
				ShortDescription: this.product?.shortDescription,
				Price: this.product?.price,
				DescriptionId: this.product?.descriptionId,
				BrandId: this.product?.brandId,
				OwnerId: this.product?.ownerId,
				CategoryId: this.product?.categoryId,
			});

			this.form.disable();

			this.formattedDescription = this.product?.description?.content.replace(/\n/g, '<br>');
			if (this.product?.images?.length > 0) {
				this.mainImageUrl = this.product.images[0].linkImage;
			}
			this.loadProductSizes(this.product?.productId);
			this.loadComments(this.product?.productId);
		}
	}

	loadComments(productId: number): void {
		this.productService.getComments(productId).subscribe(
			(data) => {
				this.comments = data.map((comment: any) => ({
					...comment,
					formattedTimestamp: formatDate(comment.timestamp, 'medium', 'en-US'),
					formattedReplyTimestamp: comment.replyTimestamp ? formatDate(comment.replyTimestamp, 'medium', 'en-US') : null
				}));
				this.commentCount = this.comments.length;
			},
			(error) => {
				console.error('There was an error fetching comments!', error);
			}
		);
	}

	submitReply(review: any) {
		if (!this.replyContent.trim()) {
			this.alertService.fireSmall('error', 'Reply cannot be empty.');
			return;
		}

		const replyData = {
			reply: this.replyContent,
			ownerId: 1, // Example ownerId, change as needed
			replyTimestamp: new Date().toISOString()
		};

		this.productService.replyToComment(review.commentId, replyData).subscribe(
			(response) => {
				review.reply = this.replyContent;
				review.replyAuthor = 'You'; // Example: Set current user as the reply author
				review.formattedReplyTimestamp = new Date().toLocaleString();
				this.replyContent = '';
				this.replyIndex = null;
				this.alertService.fireSmall('success', 'Reply submitted successfully.');
			},
			(error) => {
				console.error('Error submitting reply:', error);
				this.alertService.fireSmall('error', 'Failed to submit reply.');
			}
		);
	}

	toggleReplyInput(index: number) {
		// Set the replyIndex to the index of the review being replied to
		this.replyIndex = this.replyIndex === index ? null : index;
		this.replyContent = '';
	}


	cancelReply() {
		this.replyIndex = null;
		this.replyContent = '';
	}

	scrollThumbnails(direction: 'left' | 'right') {
		const thumbnails = document.querySelector('.thumbnail-images') as HTMLElement;
		const scrollAmount = direction === 'left' ? -100 : 100;
		if (thumbnails) {
			thumbnails.scrollBy({
				left: scrollAmount,
				behavior: 'smooth'
			});
		}
	}

	checkScrollable() {
		const thumbnails = document.querySelector('.thumbnail-images') as HTMLElement;
		if (thumbnails) {
			this.isScrollable = thumbnails.scrollWidth > thumbnails.clientWidth;
		}
	}

	selectSize(size: any) {
		if (size.quantity === 0) {
			return;
		}
		this.selectedSize = size;
		this.maxQuantity = size.quantity;
		this.quantity = 1;
	}

	decreaseQuantity() {
		if (this.quantity > 1) {
			this.quantity--;
		}
	}

	increaseQuantity() {
		if (this.quantity < this.maxQuantity) {
			this.quantity++;
		}
	}

	updateMainImage(imageUrl: string) {
		this.mainImageUrl = imageUrl;
		this.checkScrollable();
	}

	toggleReviews() {
		this.showReviews = !this.showReviews;
	}

	addToCart() {
		if (!this.selectedSize) {
			alert('Please select a size');
			return;
		}

		// Implement add to cart functionality here
	}

	findInStore() {
		console.log('Finding product in store');
	}

	getStars(ratePoint: number): any[] {
		const totalStars = 5;
		const fullStars = Math.floor(ratePoint);
		const partialStar = ratePoint % 1;
		const emptyStars = totalStars - fullStars - (partialStar > 0 ? 1 : 0);

		return [
			...Array(fullStars).fill('full'),
			...(partialStar > 0 ? [{ type: 'partial', width: partialStar * 100 + '%' }] : []),
			...Array(emptyStars).fill('empty')
		];
	}

	loadProductSizes(productId: number): void {
		this.productService.getProductSizesByProductId(productId).subscribe(
			(data) => {
				this.productSizes = data.data.sort((a: any, b: any) => parseFloat(a.sizeName) - parseFloat(b.sizeName));
			},
			(error) => {
				console.error('There was an error fetching product sizes!', error);
			}
		);
	}

	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}
