import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { OwnerService } from '../../services/owner.service';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-order-admin-page',
  templateUrl: './order-admin-page.component.html',
  styleUrls: ['./order-admin-page.component.scss']
})
export class OrderAdminPageComponent {
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
		private orderService: OrderService,
		private alertService: AlertService,
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Order',
			link: '/admin/order'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging })
	}

	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		this.orderService.getLists(params).subscribe((res: any) => {
			this.loading = false;

			if (res?.data) {
				console.info("===========[getDataListBrand] ===========[res] : ", res);
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
				}
				this.paging.total = res?.data?.length || 0;
			}
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Owner';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			this.orderService.createOrUpdateData(data?.form).subscribe((res: any) => {
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
		} else {
			this.loading = true;
			let dataForm = data?.form;
			delete (dataForm.password);
			this.orderService.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.data) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Owner failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.orderId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Owner';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.orderId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Owner';
		this.openModal = true;
		this.typeForm = 3;

	}

	// deleteItem(id: number) {
	// 	this.alertService.fireConfirm(
	// 		'Delete Owner',
	// 		'Are you sure you want to delete this Account?',
	// 		'warning',
	// 		'Cancel',
	// 		'Delete',
	// 	)
	// 		.then((result) => {
	// 			if (result.isConfirmed) {
	// 				this.loading = true;
	// 				this.orderService.deleteData(id).subscribe((res: any) => {
	// 					this.loading = false;
	// 					if (res?.message == 'Account deleted successfully.') {
	// 						this.alertService.fireSmall('success', res?.message);
	// 						this.getDataList({ page: 1, pageSize: 10 })
	// 					} else if (res?.errors) {
	// 						this.alertService.showListError(res?.errors);
	// 					} else {
	// 						this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
	// 					}
	// 				})
	// 			}
	// 		})

	// }

	// updateBan(id: any, isBan: boolean) {
	// 	this.alertService.fireConfirm(
	// 		`${isBan ? 'Ban' : 'UnBan'} Owner`,
	// 		`Are you sure you want to ${isBan ? 'Ban' : 'UnBan'} this Owner?`,
	// 		'warning',
	// 		'Cancel',
	// 		'Yes',
	// 	)
	// 		.then((result) => {
	// 			if (result.isConfirmed) {
	// 				this.loading = true;
	// 				this.orderService.updateBan(id, isBan).subscribe((res: any) => {
	// 					this.loading = false;
	// 					if (res?.message == `Owner ${isBan ? 'banned' : 'unbanned'} successfully.`) {
	// 						this.alertService.fireSmall('success', res?.message);
	// 						this.getDataList({ page: 1, pageSize: 10 })
	// 					} else if (res?.errors) {
	// 						this.alertService.showListError(res?.errors);
	// 					} else {
	// 						this.alertService.fireSmall('error', res?.message || `${isBan ? 'banned' : 'unbanned'}  Owner failed!`);
	// 					}
	// 				})
	// 			}
	// 		})
	// }


	formSearch = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	pageChanged(e: any) {
		this.paging.page = e;
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}
}
