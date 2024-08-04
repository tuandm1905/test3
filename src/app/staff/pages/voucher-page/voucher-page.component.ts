import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { VoucherService } from '../../services/voucher.service';
import { OwnerService } from '../../services/owner.service';

@Component({
  selector: 'app-voucher-page',
  templateUrl: './voucher-page.component.html',
  styleUrl: './voucher-page.component.scss'
})
export class VoucherPageComponent {

	dataList: any =[];
	modalTitle: string = '';
	openModal: boolean = false;

	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private service: VoucherService,
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
			label: 'Voucher',
			link: '/owner/voucher'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging, pageSize:10000 });
		this.getOwners()
	}

	dataListAll = []
	getDataList(params: any) {
		this.loading = true;
		this.service.getLists(params).subscribe((res: any) => {
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

	owners = []
	getOwners() {
		this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			console.info("===========[Brands] ===========[res] : ", res);
			if(res?.data) {
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
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
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
		this.modalTitle = 'View Service';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: any) {
		const data = this.dataList.find((c: any) => c.voucherId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Service';
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
						if (res?.message?.includes('successfully')) {
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

