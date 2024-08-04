import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { INIT_PAGING } from '../../helpers/constant';
import { GuestconsultationService } from '../../services/guestconsultation.service';
import { StaffService } from '../../services/staff.service';

@Component({
	selector: 'app-guestconsultation-page',
	templateUrl: './guestconsultation-page.component.html',
	styleUrl: './guestconsultation-page.component.scss'
})
export class GuestconsultationPageComponent {
	dataList: any = [];
	dataListWaiting: any = [];
	dataListAccecpt: any = [];
	dataListDeny: any = [];
	selectedAccount: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;

	ownerId: number | null = null;
	userType: string = '';
	currentPage: number = 1;
	totalPages: number = 5;
	pageName: string = 'guestconsultation';

	selectedGuestId: number | null = null;
	paging: any = { ...INIT_PAGING }
	pagingWaiting: any = { ...INIT_PAGING }
	pagingAccept: any = { ...INIT_PAGING }
	pagingDeny: any = { ...INIT_PAGING }
	loading = false;
	tabType = 'all';

	tabLinks = [
		{ id: 'all', name: 'All' },
		{ id: 'waiting', name: 'Waiting' },
		{ id: 'accept', name: 'Accept' },
		{ id: 'deny', name: 'Deny' },
	];

	typeForm = 0;

	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Guest Consultation',
			link: '/owner/guestconsultation'
		}
	];

	constructor(
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private guestService: GuestconsultationService,
		private staffService: StaffService
	) {

	}

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;

		if (this.userType === 'Staff') {
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Owner:', this.ownerId);
				console.log('Lấy ID của Staff xong lấy OwnerId');

				// Gọi hàm getDataList với ownerId đã được cập nhật
				this.getDataList({
					searchQuery: null,
					page: this.paging,
					pageSize: 10000,
					ownerId: this.ownerId
				});
			});
		} else {
			console.log('UserType là:', this.userType);

			// Gọi hàm getDataList với ownerId mặc định
			this.getDataList({
				searchQuery: null,
				page: this.paging,
				pageSize: 10000,
				ownerId: this.ownerId
			});
		}


		console.log('UserTyle là Owner', this.userType)

		// this.ownerId = user?.id ?? null;
		// this.userType = user?.userType ?? '';
		// if (this.userType === 'Owner' || this.userType === 'Staff') {
		// 	console.log('id này số mấy',this.ownerId);
		// 	this.getDataList({
		// 		searchQuery: null,
		// 		page: this.paging,
		// 		pageSize: 10000,
		// 		ownerId: this.ownerId
		// 	}
		// 	);
		// } else (console.log('UserTyle là Owner',this.userType))
		console.log('data du lieu', this.ownerId);
		console.log('userType', this.userType);
	}
	changeTab(type: string) {
		this.tabType = type;
		this.paging.page = 1
		switch (this.tabType) {
			case 'all':
				this.getDataList({ page: 1 });
				this.dataList = [];
				break;
			case 'waiting':
				this.getDataListWaiting({ page: 1 });
				this.dataList = [];
				break;
			case 'accept':
				this.getDataListAccept({ page: 1 });
				this.dataList = [];
				break;
			case 'deny':
				this.getDataListDeny({ page: 1 });
				this.dataList = [];
				break;
			default:
				console.error('Unknown tab type:', this.tabType);
				break;
		}

	}
	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		console.log('data', params);
		this.guestService.getLists({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 1000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng

		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					console.log('start:', start)
					console.log('end:', end)
					console.log('data', this.dataList);
				}
				this.paging.total = res?.data.length || 0;
			}
		})
	}

	getDataListWaiting(params: any) {
		this.loading = true;
		console.log('data', params);
		this.guestService.getListswaiting({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 1000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng

		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				this.dataListAll = res?.data;
				console.log('data Waiting', this.dataListAll);
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataListWaiting = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					console.log('start:', start)
					console.log('end:', end)
					console.log('data Waiting', this.dataList);
				}
				this.paging.total = res?.data.length || 0;
			}
		})
	}
	getDataListAccept(params: any) {
		this.loading = true;
		console.log('data', params);
		this.guestService.getListsaccept({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 1000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng

		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				this.dataListAll = res?.data;
				console.log('data Accept', this.dataListAll);
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataListAccecpt = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					console.log('start:', start)
					console.log('end:', end)
					console.log('data Accept', this.dataList);
				}
				this.paging.total = res?.data.length || 0;
			}
		})
	}
	getDataListDeny(params: any) {
		this.loading = true;
		console.log('data', params);
		this.guestService.getListsdeny({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 1000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng

		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataListDeny = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					console.log('start:', start)
					console.log('end:', end)
					console.log('data Deny', this.dataListDeny);
				}
				this.paging.total = res?.data.length || 0;
			}
		})
	}
	updateGuestStatus(orderId: number, id: number) {
		console.log('id guest', orderId, 'id', id);
		this.guestService.updateStatus(orderId, id).subscribe(
			response => {
				console.log('Guest Consultation status updated successfully');
				// Hiển thị thông báo cập nhật thành công
				this.alertService.fireSmall('success', 'Guest Consultation status updated successfully');
				// Sau khi cập nhật trạng thái thành công, làm mới dữ liệu của tab hiện tại
				this.updateDataListForCurrentTab();
				this.getDataListWaiting({ page: 1 });
			},
			error => {
				console.error('Error updating order status', error);
				// Hiển thị thông báo lỗi
				this.alertService.fireSmall('error', 'Error updating Guest Consultation status');
			}
		);
		this.formSearch.reset();
	}

	updateDataListForCurrentTab() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging:', currentPaging); // Debug log
		switch (this.tabType) {
			case 'all':
				this.dataList = this.dataListAll.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'waiting':
				this.dataListWaiting = this.dataListWaiting.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'accept':
				this.dataListAccecpt = this.dataListAccecpt.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'deny':
				this.dataListDeny = this.dataListDeny.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
		}
		console.log('Data List:', this.dataList); // Debug log
	}

	getPageSizeForCurrentTab() {
		switch (this.tabType) {
			case 'all':
				return this.paging;
			case 'pending':
				return this.pagingWaiting;
			case 'processing':
				return this.pagingAccept;
			case 'completed':
				return this.pagingDeny;
			default:
				return INIT_PAGING;
		}
	}
	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
	resetForm = false;
	createItem() {
		this.modalTitle = 'Create Guest Consultation';
		this.openModal = true;
		this.typeForm = 1;
	}
	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}
	search() {
		this.pageChanged(1);
		// this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
		// this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.getDataList({ ...this.paging, pageSize: 10000 })
	}
	saveItem(data: any) {
		console.log('data', data?.form)
		console.log('modalTitle', this.modalTitle)
		if (this.modalTitle === 'Create Account') {
			this.loading = true;
			this.guestService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
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
			console.log('id', data.form.staffId);
			console.log('id', data.form.image);
			this.guestService.createOrUpdateData(data?.form, data.form.staffId).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
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
		const data = this.dataList.find((c: any) => c.guestId === id);
		console.log('data', data);
		this.selected = { ...data };
		this.modalTitle = 'View Guest Consultation';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.guestId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Guest Consultation';
		this.openModal = true;
		this.typeForm = 3;

	}

	pageChanged(e: any) {
		this.paging.page = e;
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			console.log('phân trang 123', start, end);
			if (this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.fullname?.includes(this.formSearch.value?.name?.trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.fullname?.includes(this.formSearch.value?.name?.trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
		}
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
		}
	}

	nextPage() {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
		}
	}

}
