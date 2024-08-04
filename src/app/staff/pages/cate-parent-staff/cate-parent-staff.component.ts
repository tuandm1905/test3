import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { CateParentService } from '../../services/cateparent.service';


@Component({
  selector: 'app-cate-parent-staff',
  templateUrl: './cate-parent-staff.component.html',
  styleUrl: './cate-parent-staff.component.scss'
})
export class CateParentStaffComponent {
	dataList: any = [];
	modalTitle: string = '';
	openModal: boolean = false;

	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private cateparentService: CateParentService,
		private alertService: AlertService
	) {

	}
	breadCrumb: any = [
		{
			label: 'Staff',
			link: '/'
		},
		{
			label: 'CateParent',
			link: '/staff/cateparent'
		}
	];
	ngOnInit(): void {
		this.getDataListParent(this.paging);

	}
	dataListAll: any;
	getDataListParent(params: any) {
		this.loading = true;
		this.cateparentService.getListCateParent(params).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res
			if (this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.pageSize;
				let end = this.paging?.page * this.paging.pageSize;
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			this.paging.total = res?.length || 0;
		})
	}

	createItem() {
		this.modalTitle = 'Create CateParent';
		this.openModal = true;
		this.typeForm = 1;
	}
	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}
	search() {
		this.pageChanged(1);
		// this.getDataListParent({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	resetSearchForm() {
		this.formSearch.reset();
		this.getDataListParent({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			let form = data.form;
			delete form.cateParentId
			this.cateparentService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data || res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataListParent({ page: 1, pageSize: 10 });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add CateParent failed!");
				}
			})
		} else {
			this.loading = true;
			let dataForm = data?.form;
			this.cateparentService.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.data|| res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataListParent({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated CateParent failed!");
				}
			})
		}
	}
	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.cateParentId === id);
		this.selected = { ...data };
		this.modalTitle = 'View CateParent';
		this.openModal = true;
		this.typeForm = 2;
	}
	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.cateParentId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit CateParent';
		this.openModal = true;
		this.typeForm = 3;

	}
	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete CateParent',
			'Are you sure you want to delete this CateParent?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.cateparentService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataListParent({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "CateParent deleted failed!");
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
			if(this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.name?.includes(this.formSearch.value?.name?.trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.name?.includes(this.formSearch.value?.name?.trim()) )
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end )
			}
		}
	}
}

