import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { INIT_PAGING } from "../../helpers/constant";
import { BrandService } from "../../services/brand.service";
import { FormControl, FormGroup } from "@angular/forms";
import { CategoryService } from '../../services/category.service';

@Component({
	selector: 'app-brand-admin-page',
	templateUrl: './brand-admin-page.component.html',
	styleUrls: ['./brand-admin-page.component.scss']
})
export class BrandAdminPageComponent {
	dataList: any = []
	selectedBrand: any = {};
	modalTitle: string = '';
	showAddNewBrandModal: boolean = false;
	showDetailBrandModal: boolean = false;
	showUpdateBrandModal: boolean = false;
	showDeleteBrandModal: boolean = false;
	currentPage: number = 1;
	totalPages: number = 5;
	pageName: string = 'brands';
	paging: any = { ...INIT_PAGING }
	loading = false;

	categories: any = [];

	constructor(
		private brandService: BrandService,
		private categoryService: CategoryService,
		private alertService: AlertService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Brand',
			link: '/admin/brand'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging });
		this.getCategories()
	}
	dataListAll = []
	getDataList(params: any) {
		this.loading = true;
		this.brandService.getLists(params).subscribe((res: any) => {
			console.info("===========[getDataListBrand] ===========[res] : ", res);
			this.loading = false;
			this.dataList = res;
			this.dataListAll = res;
			if (this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.pageSize;
				let end = this.paging?.page * this.paging.pageSize;
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			this.paging.total = res?.length || 0;
		})
	}

	getCategories() {
		this.categoryService.getListCategory({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			console.info("===========[categories] ===========[res] : ", res);
			this.categories = res;
		})
	}

	toggleSelectAll() {
		// const allSelected = this.dataList.every(brand => brand.selected);
		// this.dataList.forEach(brand => brand.selected = !allSelected);
	}

	openAddNewBrandModal() {
		this.selectedBrand = { id: null, name: '', image: '', content: '', selected: false };
		this.modalTitle = 'Create Brand';
		this.showAddNewBrandModal = true;
	}

	closeModal() {
		this.showAddNewBrandModal = false;
		this.showDetailBrandModal = false;
		this.showUpdateBrandModal = false;
		this.showDeleteBrandModal = false;
	}


	resetSearchForm() {
		this.formSearch.reset();
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	saveItem(data: any) {
		// Log the ID and form data to the console before saving
		console.log('ID:', data?.id);
		console.log('Form Data:', data?.form);

		if (this.modalTitle === 'Create Brand') {
			this.loading = true;
			this.brandService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Brand failed!");
				}
			});
		} else {
			// Check if data.form and data.id are defined before making the API call
			if (data?.form && data?.id) {
				console.log('ID:', data.id);
				console.log('Form Data:', data.form);

				this.loading = true;
				this.brandService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
					this.loading = false;
					if (res?.message?.includes('successfully')) {
						this.alertService.fireSmall('success', res?.message);
						this.closeModal();
						this.getDataList({ page: 1, pageSize: 10 });
					} else if (res?.errors) {
						this.alertService.showListError(res?.errors);
					} else {
						this.alertService.fireSmall('error', res?.message || "Updated Brand failed!");
					}
				});
			} else {
				this.alertService.fireSmall('error', "Invalid data provided.");
			}
		}
	}


	selected: any;
	viewItem(id: number) {
		const category = this.dataList.find((c: any) => c.brandId === id);
		this.selected = { ...category };
		this.modalTitle = 'View Brand';
		this.showDetailBrandModal = true;
	}

	editItem(id: number) {
		const category = this.dataList.find((c: any) => c.brandId === id);
		console.log('Editing Brand ID:', id);
		console.log('Brand Data:', category);
		this.selected = { ...category };
		this.modalTitle = 'Edit Brand';
		this.showUpdateBrandModal = true;
	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Brand',
			'Are you sure you want to delete this brand?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.brandService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Brand failed!");
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
			console.log('brand---->', start, end, this.formSearch.value?.name);

			const searchName = this.formSearch.value?.name?.trim().toLowerCase(); // Chuyển tìm kiếm thành chữ thường

			if (searchName) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.name?.toLowerCase().includes(searchName)); // Chuyển item name thành chữ thường
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end);
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
			}
		}
	}
}
