import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { OwnerService } from '../../services/owner.service';
import { DescriptionService } from '../../services/description.service';

@Component({
	selector: 'app-product-admin-page',
	templateUrl: './product-admin-page.component.html',
	styleUrls: ['./product-admin-page.component.scss']
})
export class ProductAdminPageComponent {
	dataList: any = [];
	dataListAll: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	updateModal: boolean = false;

	pageName: string = 'products';
	paging: any = { ...INIT_PAGING }
	loading = false;

	constructor(
		private productService: ProductService,
		private alertService: AlertService,
		private brandService: BrandService,
		private ownerService: OwnerService,
		private categoryService: CategoryService,
		private descriptionService: DescriptionService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Product',
			link: '/staff/product'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging, pageSize: 10000 });
		this.getDataRelation();
	}

	getDataList(params: any) {
		this.loading = true;
		this.productService.getLists(params).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			if (this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.pageSize;
				let end = this.paging?.page * this.paging.pageSize;
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			this.paging.total = res?.length || 0;
		})
	}

	categories = []
	owners = [];
	brands = [];
	descriptions = [];
	getDataRelation() {
		this.brandService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			this.brands = res;
		});
		this.categoryService.getListCategory({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			this.categories = res;
		});
		this.descriptionService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.descriptions = res?.data;

			}
		});
		this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.owners = res?.data;
			}
		});
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Product';
		this.createModal = true;
	}

	closeModal() {
		this.createModal = false;
		this.showModal = false;
		this.updateModal = false;

	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Product') {

			this.loading = true;
			this.productService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully') ) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Product failed!");
				}
			})
		} else {
			this.loading = true;
			this.productService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully') ) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Product failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.productId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Product';
		this.showModal = true;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.productId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Product';
		this.updateModal = true;
	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Product',
			'Are you sure you want to delete this Product?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.productService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'product deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Product failed!");
						}
					})
				}
			})

	}

	updateBan(id: any, isBan: boolean) {
		this.alertService.fireConfirm(
			`${isBan ? 'Ban' : 'UnBan'} Product`,
			`Are you sure you want to ${isBan ? 'Ban' : 'UnBan'} this Product?`,
			'warning',
			'Cancel',
			'Yes',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.productService.updateBan(id, isBan).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == `Product ${isBan ? 'banned' : 'unbanned'} successfully.`) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || `${isBan ? 'banned' : 'unbanned'}  Product failed!`);
						}
					})
				}
			})
	}


	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	pageChanged(e: any) {
		this.paging.page = e;
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			console.log('brand---->',start, end, this.formSearch.value?.name);
			if(this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.name?.includes(this.formSearch.value?.name?.trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.name?.includes(this.formSearch.value?.name?.trim()) )
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end )
			}
		}
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
	}
}
