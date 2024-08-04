import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { ImportproductService } from '../../services/importproduct.service';
import { WarehouseService } from '../../services/warehouse.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-importproduct-page',
	templateUrl: './importproduct-page.component.html',
	styleUrl: './importproduct-page.component.scss'
})
export class ImportproductPageComponent {
	dataList: any = [];
	modalTitle: string = '';
	showModal: boolean = false;
	openModal: boolean = false;
	userType: string = '';
	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;
	selected: any;
	createModal: boolean = false;
	typeForm = 0;

	ownerId: number | null = null;
	currentPage: number = 1;
	totalPages: number = 5;

	breadCrumb: any = [
		{ label: 'Owner', link: '/' },
		{ label: 'Import Product', link: '/owner/importproduct' }
	];
	constructor(
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private staffService: StaffService,
		private importSerivce: ImportproductService,
		private warehouseSerivce: WarehouseService,
		private router: Router,
	) {

	}


	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.ownerId = user?.id ?? null;
		this.userType = user?.userType ?? '';
		if (this.userType == 'Staff') (
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Onwer', this.ownerId)
				console.log('Lấy ID của Staff xong lấy OwnerId')
			})
		); else if (this.userType === 'Owner')
			(
				console.log('UserTyle là Owner', this.userType)
			)
		console.log('UserTyle là Owner', this.userType)
		console.log('data du lieu', this.ownerId);
		this.getDataList(this.ownerId);
	}
	dataListAll = [];
	getDataList(ownerId: number | null) {
		this.warehouseSerivce.getLists(this.ownerId).subscribe((res: any) => {
			const warehouseId = res?.data?.warehouseId;
			console.log('ID warehouse', warehouseId);

			this.loading = true;
			this.importSerivce.getLists(warehouseId).subscribe((res: any) => {
				this.loading = false;
				this.dataListAll = res?.data;

				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
				}
				console.log('data',this.dataList);
				this.paging.total = res?.data.length || 0;
			});
		})
	}
	closeModal() {
		this.createModal = false;
		this.showModal = false;
		this.selected = null; // Reset dữ liệu được chọn
		console.log('Modal closed and state reset.');
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.adId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Blog';
		this.openModal = true;
		this.typeForm = 3;

	}
	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
	createItem() {
		this.router.navigate(['/owner/importproduct-detail']);
		this.modalTitle = 'Import Product';
		this.openModal = true;
		this.typeForm = 1;
	}
	// saveItem(data: any) {

	// 	this.loading = true;
	// 	//'data',data.form)
	// 	this.importSerivce.create(data?.form, data.id).subscribe((res: any) => {
	// 		this.loading = false;
	// 		if (res?.message.includes('successfully')) {
	// 			this.alertService.fireSmall('success', res?.message);
	// 			this.closeModal();
	// 			this.getDataList({ page: 1, pageSize: 10 })
	// 		} else if (res?.errors) {
	// 			this.alertService.showListError(res?.errors);
	// 		} else {
	// 			this.alertService.fireSmall('error', res?.message || "Updated Product failed!");
	// 		}
	// 	})
	// }
	search() {
		// this.pageChanged(1);
		// this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}
	pageChanged(e: any) {
		this.paging.page = e;
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			if (this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.title?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.title?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			// this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}
}
