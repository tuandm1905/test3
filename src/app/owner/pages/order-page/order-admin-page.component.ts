import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { OrderService } from '../../services/order.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';

@Component({
	selector: 'app-order-admin-page',
	templateUrl: './order-admin-page.component.html',
	styleUrls: ['./order-admin-page.component.scss']
})
export class OrderAdminPageComponent implements OnInit {
	dataList: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;
	updateModal: boolean = false;

	pageName: string = 'order';
	paging: any = { ...INIT_PAGING };
	pagingPending: any = { ...INIT_PAGING };
	pagingProcessing: any = { ...INIT_PAGING };
	pagingCompleted: any = { ...INIT_PAGING };
	pagingRejected: any = { ...INIT_PAGING };
	pagingCancelled: any = { ...INIT_PAGING };
	loading = false;

	ownerId: number | null = null;
	userType: string = '';

	constructor(
		private orderService: OrderService,
		private alertService: AlertService,
		private authenService: AuthenService,
		private staffService: StaffService
	) { }

	// Thêm các biến lưu dữ liệu cho từng trạng thái
	dataListPending: any = [];
	dataListProcessing: any = [];
	dataListCompleted: any = [];
	dataListRejected: any = [];
	dataListCancelled: any = [];
	dataListAll: any = [];
	tabType = 'all';

	tabLinks = [
		{ id: 'all', name: 'All' },
		{ id: 'pending', name: 'Pending' },
		{ id: 'processing', name: 'Processing' },
		{ id: 'completed', name: 'Completed' },
		{ id: 'rejected', name: 'Rejected' },
		{ id: 'cancelled', name: 'Cancelled' },
	];

	breadCrumb: any = [
		{ label: 'Owner', link: '/' },
		{ label: 'Order', link: '/owner/order' }
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;
		if (this.userType == 'Staff') (
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Onwer', this.ownerId)
				console.log('Lấy ID của Staff xong lấy OwnerId')
				if (this.userType === 'Owner' || this.userType === 'Staff') {
					console.log('id này số mấy', this.ownerId);

				}
			})
		);
		else (console.log('UserTyle là Owner', this.userType)

		);
		this.getDataListAll({ ...this.paging });
		// const user = this.authenService.getUser();
		// this.ownerId = user?.id ?? null;
		// this.userType = user?.userType ?? '';
		// if (this.userType === 'Owner') {
		//   this.getDataListAll({ ...this.paging });
		// }


		console.log('User ID:', this.ownerId);
		console.log('User Type:', this.userType);
	}

	changeTab(type: string) {
		this.tabType = type;
		this.paging.page = 1;
		this.dataList = []; // Reset dataList khi chuyển tab
		switch (this.tabType) {
			case 'all':
				this.getDataListAll({ page: 1 });
				break;
			case 'pending':
				this.getDataListPending({ page: 1 });
				break;
			case 'processing':
				this.getDataListProcessing({ page: 1 });
				break;
			case 'completed':
				this.getDataListCompleted({ page: 1 });
				break;
			case 'rejected':
				this.getDataListRejected({ page: 1 });
				break;
			case 'cancelled':
				this.getDataListCancelled({ page: 1 });
				break;
			default:
				console.error('Unknown tab type:', this.tabType);
				break;
		}
	}

	getDataListAll(params: any) {
		this.loading = true;
		this.orderService.getLists({ ownerId: this.ownerId }).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.paging.total = this.dataListAll.length;
			this.updateDataListForCurrentTab();
			console.log('Initial Data:', this.dataListAll);
		});
	}

	updateDataListForCurrentTab() {
		let name = this.formSearch.value?.name?.trim()?.toLowerCase();
		name = String(name) || null
		let start = (this.paging?.page - 1) * this.paging.pageSize;
		let end = this.paging?.page * this.paging.pageSize;
		if (name && name != '') {
			let totalSearch = this.dataListAll?.filter((item: any) => item?.codeOrder?.toLowerCase()?.includes(name));
			this.paging.total = totalSearch?.length || 0;
			this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.codeOrder?.toLowerCase()?.includes(name))
		} else {
			this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
		console.log('Data List for Current Tab:', this.dataList);
	}



	getDataListPending(params: any) {
		this.loading = true;
		this.orderService.getLists({ ownerId: this.ownerId }).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListPending = this.dataListAll.filter((item: any) => item.statusId == 1);
			this.pagingPending.total = this.dataListPending.length;
			this.TabPending();
		});
	}

	getDataListProcessing(params: any) {
		this.loading = true;
		this.orderService.getLists({ ownerId: this.ownerId }).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListProcessing = this.dataListAll.filter((item: any) => item.statusId == 2);
			this.pagingProcessing.total = this.dataListProcessing.length;
			this.TabProcessing();
		});
	}

	getDataListCompleted(params: any) {
		this.loading = true;
		this.orderService.getLists({ ownerId: this.ownerId }).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListCompleted = this.dataListAll.filter((item: any) => item.statusId == 3);
			this.pagingCompleted.total = this.dataListCompleted.length;
			this.TabCompleted();
		});
	}

	getDataListRejected(params: any) {
		this.loading = true;
		this.orderService.getLists({ ownerId: this.ownerId }).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListRejected = this.dataListAll.filter((item: any) => item.statusId == 4);
			this.pagingRejected.total = this.dataListRejected.length;
			this.TabRejected();
		});
	}

	getDataListCancelled(params: any) {
		this.loading = true;
		this.orderService.getLists({ ownerId: this.ownerId }).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListCancelled = this.dataListAll.filter((item: any) => item.statusId == 5);
			this.pagingCancelled.total = this.dataListCancelled.length;
			this.TabCancelled();
		});
	}

	TabAll() {
		const currentPaging = this.getPageSizeForCurrentTab();
		this.dataList = this.dataListAll.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
	}

	TabPending() {
		const currentPaging = this.getPageSizeForCurrentTab();
		this.dataList = this.dataListPending.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
	}

	TabProcessing() {
		const currentPaging = this.getPageSizeForCurrentTab();
		this.dataList = this.dataListProcessing.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
	}

	TabCompleted() {
		const currentPaging = this.getPageSizeForCurrentTab();
		this.dataList = this.dataListCompleted.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
	}

	TabRejected() {
		const currentPaging = this.getPageSizeForCurrentTab();
		this.dataList = this.dataListRejected.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
	}

	TabCancelled() {
		const currentPaging = this.getPageSizeForCurrentTab();
		this.dataList = this.dataListCancelled.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
	}

	pageChanged(e: any) {
		this.paging.page = e;
		this.TabAll();
	}

	pageChangedPending(e: any) {
		this.pagingPending.page = e;
		this.TabPending();
	}

	pageChangedProcessing(e: any) {
		this.pagingProcessing.page = e;
		this.TabProcessing();
	}

	pageChangedCompleted(e: any) {
		this.pagingCompleted.page = e;
		this.TabCompleted();
	}

	pageChangedRejected(e: any) {
		this.pagingRejected.page = e;
		this.TabRejected();
	}

	pageChangedCancelled(e: any) {
		this.pagingCancelled.page = e;
		this.TabCancelled();
	}

	getPageSizeForCurrentTab() {
		switch (this.tabType) {
			case 'all':
				return this.paging;
			case 'pending':
				return this.pagingPending;
			case 'processing':
				return this.pagingProcessing;
			case 'completed':
				return this.pagingCompleted;
			case 'rejected':
				return this.pagingRejected;
			case 'cancelled':
				return this.pagingCancelled;
			default:
				return INIT_PAGING;
		}
	}

	updateOrderStatus(orderId: number, statusId: number) {
		const statusText = statusId === 1 ? 'Pending' :
			statusId === 2 ? 'Processing' :
				statusId === 3 ? 'Completed' :
					statusId === 4 ? 'Rejected' :
						statusId === 5 ? 'Cancelled' : 'Unknown';

		this.alertService.fireConfirm(
			`Update Order Status`,
			`Are you sure you want to update the status to ${statusText}?`,
			'warning',
			'Cancel',
			'Yes'
		).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this.orderService.status(orderId, statusId).subscribe((res: any) => {
					this.loading = false;
					if (res?.message === 'Confirm order successful!') {
						this.alertService.fireSmall('success', `Update Status ${statusText}.`);
						this.changeTab(this.tabType);
					} else if (res?.errors) {
						this.alertService.showListError(res?.errors);
					} else {
						this.alertService.fireSmall('error', res?.message || `Failed to update order status!`);
					}
				});
			}
		});
	}

	closeModal() {
		this.createModal = false;
		this.showModal = false;
		this.updateModal = false;
		this.openModal = false;
	}
	search() {
		if (this.tabType !== 'all') {
			// Only search in "All" tab
			return;
		}

		const searchValue = this.formSearch.value.name;
		const searchParams = searchValue ? String(searchValue).trim().toLowerCase() : '';

		this.paging.page = 1;

		// if (searchParams) {
		// 	this.dataList = this.dataListAll.filter((item: any) =>
		// 		item.codeOrder.toLowerCase().includes(searchParams)
		// 	);
		// } else {
		// 	this.dataList = this.dataListAll;
		// }

		// this.paging.total = this.dataList.length;
		this.updateDataListForCurrentTab();
		console.log('Filtered Data List:', this.dataList);
	}




	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.orderId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Order';
		this.openModal = true;
	}

	formSearch: any = new FormGroup({
		name: new FormControl('')
	});

}
