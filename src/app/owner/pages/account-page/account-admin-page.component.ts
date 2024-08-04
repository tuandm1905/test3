import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { StaffService } from '../../services/staff.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';

@Component({
	selector: 'app-account-admin-page',
	templateUrl: './account-admin-page.component.html',
	styleUrl: './account-admin-page.component.scss'
})
export class AccountAdminPageComponent {
	dataList: any = [];
	selectedAccount: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	ownerId: number | null = null;
	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;
	userType: string = '';
	currentPage: number = 1;
	totalPages: number = 5;
	pageName: string = 'accounts';

	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private staffService: StaffService,
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
	) {

	}

	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Account',
			link: '/owner/account'
		}
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.ownerId = user?.id ?? null;
		this.userType = user?.userType ?? '';
		if (this.userType === 'Owner') {
			console.log(this.ownerId);
			this.getDataList({
				searchQuery: null,
				page: this.paging,
				pageSize: 10000,
				ownerId: this.ownerId
			}
			);
		}
	}
	// dataListAll: any;
	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		console.log('data',params);
		this.staffService.getLists({ 
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 100,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng
			
		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					console.log('start:',start)
					console.log('end:',end)
				}
				this.paging.total = res?.data.length || 0;
			}
		})
	}

	createItem() {
		this.modalTitle = 'Create New Staff';
		this.openModal = true;
		this.typeForm = 1;
	}

	resetForm = false;
	closeModal() {
		this.openModal = false;
		this.typeForm = 0;
		this.selected = null;

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
		console.log('data',data?.form)
		console.log('modalTitle',this.modalTitle)
		data.form.ownerId = Number(this.ownerId)
		if (this.modalTitle === 'Create Account') {
			this.loading = true;
			this.staffService.createOrUpdateData(data?.form).subscribe((res: any) => {
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
			console.log('id',data.form.staffId);
			console.log('id',data.form.image);
			this.staffService.createOrUpdateData(data?.form, data.form.staffId).subscribe((res: any) => {
				this.loading = false;
				if (res?.message?.includes('successfully')) {
					console.log('ảnh staff',data);
				  this.staffService.updateImage(data.form).subscribe(() => {
					console.log('update ảnh')
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 });
				  }, error => {
					this.alertService.fireSmall('error', 'Failed to update avatar');
				  });
				} else if (res?.errors) {
				  this.alertService.showListError(res?.errors);
				} else {
				  this.alertService.fireSmall('error', res?.message || "Updated Account failed!");
				}
			  });
			  
		
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.staffId === id);
		console.log('data',data);
		this.selected = { ...data };
		this.modalTitle = 'View Account';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.staffId === id);
		console.log('Selected data for edit:', data); // Log data found for edit

	if (!data) {
		console.error('No data found for ID:', id); // Log error if no data is found
		return;
	}
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
					this.staffService.deleteData(id).subscribe((res: any) => {
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
				}
			})

	}

	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
	// pageChanged(e: any) {
	// 	this.paging.page = e;
	// 	// this.getDataList({ ...this.paging, ...this.formSearch.value })
	// 	if (this.dataListAll?.length > 0) {
	// 		let start = (this.paging?.page - 1) * this.paging.pageSize;
	// 		let end = this.paging?.page * this.paging.pageSize;
	// 		console.log('phân trang 123',start, end);
	// 		if (this.formSearch.value?.name) {
	// 			let totalSearch = this.dataListAll?.filter((item: any) => item?.fullname?.includes(this.formSearch.value?.name?.trim()));
	// 			this.paging.total = totalSearch?.length || 0;
	// 			this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.fullname?.includes(this.formSearch.value?.name?.trim()))
	// 		} else {
	// 			this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
	// 		}
	// 	}
	// }

	pageChanged(e: any) {
		this.paging.page = e;
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			console.log('brand---->', start, end, this.formSearch.value?.name);

			const searchName = this.formSearch.value?.name?.trim().toLowerCase(); // Chuyển tìm kiếm thành chữ thường

			if (searchName) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.fullname?.toLowerCase().includes(searchName)); // Chuyển item name thành chữ thường
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end);
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
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
