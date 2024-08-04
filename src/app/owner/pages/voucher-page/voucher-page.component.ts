import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { VoucherService } from '../../services/voucher.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';

@Component({
	selector: 'app-voucher-page',
	templateUrl: './voucher-page.component.html',
	styleUrl: './voucher-page.component.scss'
})
export class VoucherPageComponent {

	dataList: any = [];
	modalTitle: string = '';
	openModal: boolean = false;
	ownerId: number | null = null;
	paging: any = { ...INIT_PAGING }
	loading = false;
	userType: string = '';

	typeForm = 0;

	constructor(
		private service: VoucherService,
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private staffService: StaffService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Voucher',
			link: '/owner/voucher'
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
					this.getDataList({
						searchQuery: null,
						page: this.paging,
						pageSize: 10000,
						ownerId: this.ownerId
					}
					);
				}
			})
		}
		else {
			console.log('UserTyle là Owner', this.userType)
			this.getDataList({
				searchQuery: null,
				page: this.paging,
				pageSize: 10000,
				ownerId: this.ownerId
			}
			);
		};

		this.getOwners()
	}

	dataListAll = []
	getDataList(params: any) {
		this.loading = true;
		this.service.getLists({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 10000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng
		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				// console.info("===========[getDataListBrand] ===========[res] : ", res);
				this.dataListAll = res?.data;
				console.info("===========[getDataList] ===========[res] : ", this.dataListAll);
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					console.log('data',this.dataList)
				}
				this.paging.total = res?.data?.length || 0;
			}
		})
	}

	owners = []
	getOwners() {
		this.ownerService.getLists({ page: 1, pageSize: 100, ownerId: this.ownerId }).subscribe((res: any) => {
			console.info("===========[Brands] ===========[res] : ", res);
			if (res?.data) {
				this.owners = res?.data;
			}
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Voucher';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}

	search() {
		if (this.userType === 'Owner') {
			this.pageChanged(1);
		}
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
		// this.search();
	}

	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			data.form.ownerId = this.ownerId;
			console.log('data fomr',data.form)
			this.service.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Service failed!");
				}
			})
		} else {
			this.loading = true;
			let dataForm = data?.form;
			console.log('data form', dataForm);
			delete (dataForm.password);
			this.service.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.data) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Service failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: any) {
		const data = this.dataList.find((c: any) => c.voucherId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Voucher';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: any) {
		const data = this.dataList.find((c: any) => c.voucherId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Voucher';
		this.openModal = true;
		this.typeForm = 3;

	}

	deleteItem(id: any) {
		this.alertService.fireConfirm(
			'Delete Voucher',
			'Are you sure you want to delete this Voucher?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.service.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Voucher deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Voucher deleted failed!");
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
			if (this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.voucherId?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.voucherId?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			// this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}
}

