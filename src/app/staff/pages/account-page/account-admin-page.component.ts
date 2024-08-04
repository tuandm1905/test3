import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { AccountService } from '../../services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';

@Component({
	selector: 'app-account-admin-page',
	templateUrl: './account-admin-page.component.html',
	styleUrl: './account-admin-page.component.scss'
})
export class AccountAdminPageComponent {
	dataList: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;

	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private accountService: AccountService,
		private alertService: AlertService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Account',
			link: '/owner/account'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging })
	}
	dataListAll = []
	getDataList(params: any) {
		this.loading = true;
		this.accountService.getLists(params).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res?.data;
			this.updateDataList();
			// if (this.dataListAll?.length > 0) {
			// 	let start = (this.paging?.page - 1) * this.paging.pageSize;
			// 	let end = this.paging?.page * this.paging.pageSize;
			// 	this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			// 	this.updateDataList();
			// }
			this.paging.total = res?.data?.length || 0;
		})
	}

	updateDataList() {
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			if(this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.name?.includes(this.formSearch.value?.name?.trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.name?.includes(this.formSearch.value?.name?.trim()) )
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end )
			}
		}
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
		this.paging.page = 1;
		this.updateDataList();
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Account') {
			this.loading = true;
			this.accountService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Account added successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Account failed!");
				}
			})
		} else {
			this.loading = true;
			this.accountService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Account updated successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Account failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.accountId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Account';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.accountId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Account';
		this.openModal = true;
		this.typeForm = 3;

	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Account',
			'Are you sure you want to delete this Account?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.accountService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Account deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
						}
					})
				}
			})

	}

	updateBan(id: any, isBan: boolean) {
		this.alertService.fireConfirm(
			`${isBan ? 'Ban' : 'UnBan'} Account`,
			`Are you sure you want to ${isBan ? 'Ban' : 'UnBan'} this Account?`,
			'warning',
			'Cancel',
			'Yes',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.accountService.updateBan(id, isBan).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == `Account ${isBan ? 'banned' : 'unbanned'} successfully.`) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
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
		this.updateDataList();
	}
}
