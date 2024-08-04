import { Component } from '@angular/core';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { WarehouseService } from '../../services/warehouse.service';
import { FormControl, FormGroup } from '@angular/forms';
import { StaffService } from '../../services/staff.service';

@Component({
	selector: 'app-warehouse-page',
	templateUrl: './warehouse-page.component.html',
	styleUrl: './warehouse-page.component.scss'
})
export class WarehousePageComponent {
	dataList: any = [];
	dataListAll: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	ownerId: number | null = null;
	userType: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	updateModal: boolean = false;
	openModal: boolean = false; // Mặc định là false hoặc giá trị mặc định khác

	pageName: string = 'warehouse';
	paging: any = { ...INIT_PAGING }
	loading = false;
	typeForm = 0;

	constructor(
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private warehouseService: WarehouseService,
		private staffService: StaffService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Warehouse',
			link: '/'
		},
		{
			label: 'Warehouse',
			link: '/owner/warehouse'
		}
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;
		if (this.userType == 'Staff') {
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Onwer', this.ownerId)
				console.log('Lấy ID của Staff xong lấy OwnerId')
				if (this.userType === 'Owner' || this.userType === 'Staff') {
					console.log('id này số mấy', this.ownerId);
					this.getDataList({ ...this.paging, pageSize: 10000 });
				}
			})
		}
		else {
			console.log('UserTyle là Owner', this.userType)
			this.getDataList({ ...this.paging, pageSize: 10000 });
		};
		// const user = this.authenService.getUser();
		// this.ownerId = user?.id ?? null;
		// this.userType = user?.userType ?? '';
		// if (this.userType === 'Owner') {
		// 	this.getDataList({ ...this.paging, pageSize: 10000 });
		// }
		// console.log('User ID:', this.ownerId);
		// console.log('User Type:', this.userType);


	}


	getUserIdFromLocalStorage(): number | null {
		const user = this.authenService.getUser();
		return user?.id ?? null; // Giả sử user có trường id
	}
	getDataList(params: any) {
		this.loading = true;
		this.warehouseService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res?.data?.warehouseDetails || [];
			if (this.dataListAll.length > 0) {
				let start = (this.paging.page - 1) * this.paging.pageSize;
				let end = this.paging.page * this.paging.pageSize;
				this.dataList = this.dataListAll.slice(start, end);
				this.paging.total = res?.data?.totalCount || this.dataListAll.length; // Cập nhật tổng số dữ liệu nếu có
			} else {
				this.dataList = [];
				this.paging.total = 0;
			}
		});
	}
	
	createItem() {
		this.modalTitle = 'Create Warehouse';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;
	}

	search() {
		if (this.userType === 'Owner' || this.userType === 'Staff') {
			this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value });
		}
	}
	

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Warehouse') {

			this.loading = true;
			this.warehouseService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully')) {
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
			this.warehouseService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully')) {
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
		const data = this.dataList.find((c: any) => { console.log('warehouseId', c.warehouseId); c.warehouseId === id });
		console.log('view', data);
		this.selected = data;
		this.modalTitle = 'View Warehouse Details';
		this.typeForm = 2;
		this.openModal = true;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => { console.log('warehouseId', c.warehouseId); c.warehouseId === id });
		console.log('edit', data);
		this.selected = { ...data };
		this.modalTitle = 'Edit Warehouse';
		this.openModal = true;
		this.typeForm = 3
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
					console.log('ID delete', id);
					this.warehouseService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						console.log('test', res?.message);
						if (res?.message == 'Product is deleted successfully') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
							console.log('1', res?.message);
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
							console.log('2');
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Product failed!");
							console.log('3');
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
			if (this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.voucherId?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.voucherId?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
		}
	}

}
