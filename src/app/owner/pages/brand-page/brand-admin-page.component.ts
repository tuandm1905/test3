import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { INIT_PAGING } from "../../helpers/constant";
import { BrandService } from "../../services/brand.service";
import { FormControl, FormGroup } from "@angular/forms";
import { CategoryService } from '../../services/category.service';
import { StaffService } from '../../services/staff.service';
import { AuthenService } from '../../../admin/services/authen.service';

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
	ownerId: number | null = null;
	userType: string = '';
	constructor(
		private brandService: BrandService,
		private categoryService: CategoryService,
		private alertService: AlertService,
		private staffService: StaffService,
		private authenService: AuthenService,
	) {

	}

	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Brand',
			link: '/owner/brand'
		}
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		if (this.userType == 'Staff') (
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Onwer', this.ownerId)
				console.log('Lấy ID của Staff xong lấy OwnerId')
				if (this.userType === 'Owner' || this.userType === 'Staff') {
					console.log('id này số mấy', this.ownerId);
					this.getDataList({ ...this.paging });
					this.getCategories()
				}
			})
		);
		else (console.log('UserTyle là Owner', this.userType)

		);

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
		if (this.modalTitle === 'Create Brand') {
			// category.id = this.categories.length + 1;
			// this.categories.push(category);
			this.loading = true;
			this.brandService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Brand failed!");
				}
			})
		} else {
			this.loading = true;
			this.brandService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Brand failed!");
				}
			})
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
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			console.log('brand---->', start, end, this.formSearch.value?.name);
			if (this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.name?.includes(this.formSearch.value?.name?.trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.name?.includes(this.formSearch.value?.name?.trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
		}
	}
}
