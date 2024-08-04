import { Component, Input, Output, EventEmitter, input, ViewChild } from '@angular/core';
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


	selectedSize: any;
	maxQuantity: number = 0;
	quantity: number = 1;
	mainImageUrl: string = '';
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
	) {

	}

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.

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

			console.log('data', this.product)
			this.formattedDescription = this.product?.description?.content.replace(/\n/g, '<br>');
			if (this.product?.images?.length > 0) {
				this.mainImageUrl = this.product.images[0].linkImage;
			}
			console.log('Product sizes:', this.productSizes);
			this.loadProductSizes(this.product?.productId);
			this.loadComments(this.product?.productId);
		}

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
		// Khi mở modal hoặc tải sản phẩm, kiểm tra dữ liệu kích thước


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
	showReviews: boolean = false;
	toggleReviews() {
		this.showReviews = !this.showReviews;
	}


	comments: any[] = [];
	loadComments(productId: number): void {
		this.productService.getComments(productId).subscribe(
			(data) => {
				this.comments = data.map((comment: any) => {
					return {
						...comment,
						formattedTimestamp: formatDate(comment.timestamp, 'medium', 'en-US'),
						formattedReplyTimestamp: comment.replyTimestamp ? formatDate(comment.replyTimestamp, 'medium', 'en-US') : null
					};
				});
				this.commentCount = this.comments.length; // Cập nhật số lượng bình luận
			},
			(error) => {
				console.error('There was an error fetching comments!', error);
			}
		);
		console.log()
	}
	addToCart() {
		if (!this.selectedSize) {
			alert('Please select a size');
			return;
		}

		// const accountId = this.authenService.getAccountIdFromToken();
		// if (accountId === null) {
		//   console.error('Account ID is null!');
		//   return;
		// }

		// const ownerId = this.product.ownerId;
		// const productSizeId = this.selectedSize.productSizeId;

		// this.cartService.createCartItem(accountId, productSizeId, ownerId, this.quantity).subscribe(
		//   (data) => {
		// 	console.log('Product added to cart:', data);
		// 	alert('Product added to cart successfully');
		// 	this.loadCartItems(accountId);
		//   },
		//   (error) => {
		// 	console.error('There was an error adding the product to the cart!', error);
		//   }
		// );
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
				console.log('size giay',this.productSizes);
			},
			(error) => {
				console.error('There was an error fetching product sizes!', error);
			}
		);
	}
	isDescriptionFullView: boolean = false; // Trạng thái để theo dõi xem có mở rộng hay không

	// toggleDescriptionFullView(): void {
	// 	this.isDescriptionFullView = !this.isDescriptionFullView;
	// 	const descriptionElement = document.querySelector('.description');
	// 	const toggleButton = document.querySelector('.toggle-button');

	// 	if (descriptionElement && toggleButton) {
	// 	  if (this.isDescriptionFullView) {
	// 		descriptionElement.classList.add('full-view');
	// 		toggleButton.textContent = 'Show less';
	// 	  } else {
	// 		descriptionElement.classList.remove('full-view');
	// 		toggleButton.textContent = 'Show more';
	// 	  }
	// 	} else {
	// 	  console.error('Could not find description element or toggle button');
	// 	}
	//   }
	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
