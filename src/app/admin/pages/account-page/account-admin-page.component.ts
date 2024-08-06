import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { AccountService } from '../../services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { OwnerService } from '../../services/owner.service';
import { HttpParams } from '@angular/common/http';

@Component({
	selector: 'app-account-admin-page',
	templateUrl: './account-admin-page.component.html',
	styleUrl: './account-admin-page.component.scss'
})
export class AccountAdminPageComponent {
	dataList: any = [];

	tabType = 'user';
	tabLinks = [
		{
			id: 'user',
			name: 'User'
		},
		{
			id: 'owner',
			name: 'Owner'
		}
	];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;

	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;
	formSearch = new FormGroup({
		id: new FormControl(null),
		keyword: new FormControl(null)
	});
	constructor(
		private accountService: AccountService,
		private alertService: AlertService,
		private ownerService: OwnerService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Account',
			link: '/admin/account'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging })
	}

	dataListAll: any
	getDataList(params: any) {
		console.log('Executing getDataList() with parameters:', params);
		this.loading = true;
		if (this.tabType == 'user') {
			this.accountService.getLists({ ...params, pageSize: 10 }).subscribe((res: any) => {
				this.loading = false;
				console.log('User', res);
				this.dataListAll = res;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
				}
				// this.dataList = this.dataListAll
				this.paging.total = res?.length || 0;
			});
		} else {
			// console.log('data', params);
			this.ownerService.getLists({ ...params, pageSize: 100 }).subscribe((res: any) => {
				this.loading = false;
				// console.log('Owner', res);
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					// this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end && !item.isBan)
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
				}
				this.paging.total = res?.data?.length || 0;
			})
		}

	}

	changeTab(type: any) {
		this.tabType = type;
		this.getDataList({ page: 1 })

	}


	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Account';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}

	search() {
		console.log('Executing search() function...');
		console.log('Form search value:', this.formSearch.value);
		// Thực hiện các thao tác khác như gọi getDataList()
		if (this.tabType == 'user') {
			this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
		} else {
			const searchQuery = this.formSearch.value.keyword || '';
			const params = new HttpParams()
				.set('searchQuery', searchQuery)
			this.getDataList({ searchQuery: searchQuery, ...this.paging, page: 1 });
		}

	}


	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		this.loading = true;
		if (this.tabType == 'user') {
			this.accountService.createOrUpdateData(data?.form, data?.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Action Account failed!");
				}
			});
		} else {

			this.ownerService.createOrUpdateData(data?.form, data?.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.data) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Owner failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		if (this.tabType == 'user') {
			let data = this.dataList.find((c: any) => c.accountId === id);
			this.selected = { ...data };
			this.modalTitle = 'View Account';
		} else {
			let data = this.dataList.find((c: any) => c.ownerId === id);
			this.selected = { ...data };
			this.modalTitle = 'View Owner';
		}
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		if (this.tabType == 'user') {
			let data = this.dataList.find((c: any) => c.accountId === id);
			this.selected = { ...data };
			this.modalTitle = 'Edit Account';
		} else {
			let data = this.dataList.find((c: any) => c.ownerId === id);
			this.selected = { ...data };
			this.modalTitle = 'Edit Owner';
		}
		this.openModal = true;
		this.typeForm = 3;

	}

	// deleteItem(id: number) {
	// 	this.alertService.fireConfirm(
	// 		'Delete',
	// 		'Are you sure you want to delete this item?',
	// 		'warning',
	// 		'Cancel',
	// 		'Delete',
	// 	)
	// 		.then((result) => {
	// 			if (result.isConfirmed) {
	// 				this.loading = true;
	// 				if(this.tabType == 'user') {
	// 					this.accountService.deleteData(id).subscribe((res: any) => {
	// 						this.loading = false;
	// 						if (res?.message?.includes('successfully')) {
	// 							this.alertService.fireSmall('success', res?.message);
	// 							this.getDataList({ page: 1, pageSize: 10 })
	// 						} else if (res?.errors) {
	// 							this.alertService.showListError(res?.errors);
	// 						} else {
	// 							this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
	// 						}
	// 					})
	// 				} else {
	// 					this.ownerService.deleteData(id).subscribe((res: any) => {
	// 						this.loading = false;
	// 						if (res?.message?.includes('successfully')) {
	// 							this.alertService.fireSmall('success', res?.message);
	// 							this.getDataList({ page: 1, pageSize: 10 })
	// 						} else if (res?.errors) {
	// 							this.alertService.showListError(res?.errors);
	// 						} else {
	// 							this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
	// 						}
	// 					})
	// 				}
	// 			}
	// 		})

	// }

	updateBan(id: any, isBan: boolean) {
		this.alertService.fireConfirm(
			`${isBan ? 'Ban' : 'UnBan'} Item`,
			`Are you sure you want to ${isBan ? 'Ban' : 'UnBan'} this Item?`,
			'warning',
			'Cancel',
			'Yes',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					if (this.tabType == 'user') {
						this.accountService.updateBan(id, isBan).subscribe((res: any) => {
							this.loading = false;
							if (res?.message?.includes('successfully')) {
								this.alertService.fireSmall('success', res?.message);
								this.getDataList({ page: 1, pageSize: 10 })
							} else if (res?.errors) {
								this.alertService.showListError(res?.errors);
							} else {
								this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
							}
						})
					} else {
						this.ownerService.updateBan(id, isBan).subscribe((res: any) => {
							this.loading = false;
							if (res?.message?.includes('successfully')) {
								this.alertService.fireSmall('success', res?.message);
								this.getDataList({ page: 1, pageSize: 10 })
							} else if (res?.errors) {
								this.alertService.showListError(res?.errors);
							} else {
								this.alertService.fireSmall('error', res?.message || `${isBan ? 'banned' : 'unbanned'}  Owner failed!`);
							}
						})
					}
				}
			})
	}




	pageChanged(e: any) {
		this.paging.page = e;
		console.log('data paging page',this.paging.page);
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}

}
