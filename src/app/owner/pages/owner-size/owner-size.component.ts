import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { OwnerService } from '../../services/owner.service';
import { DescriptionService } from '../../services/description.service';
import { CateParentService } from '../../services/cateparent.service';
import { SizeService } from '../../services/size.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';

@Component({
	selector: 'app-owner-size',
	templateUrl: './owner-size.component.html',
	styleUrl: './owner-size.component.scss'
})
export class OwnerSizeComponent {
	dataList: any = [];
	modalTitle: string = '';
	openModal: boolean = false;
	ownerId: number | null = null;
	paging: any = { ...INIT_PAGING }
	loading = false;
	userType: string = '';
	typeForm = 0;

	constructor(
		private cateparentService: CateParentService,
		private productService: ProductService,
		private alertService: AlertService,
		private sizeService: SizeService,
		private authenService: AuthenService,
		private ownerService: OwnerService,
		private staffService: StaffService
	) {

	}
	// breadCrumb: any = [
	// 	{
	// 		label: 'Owner',
	// 		link: '/'
	// 	},
	// 	{
	// 		label: 'Size',
	// 		link: '/owner/size'
	// 	}
	// ];
	breadCrumb: any = [];
	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;
		this.breadCrumb = [
			{
				label: this.userType === 'Staff' ? 'Staff' : 'Owner',
				link: '/',
			},
			{
				label: 'Size',
				link: '/owner/size'
			},
		];
		if (this.userType == 'Staff') {
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Onwer', this.ownerId)
				console.log('Lấy ID của Staff xong lấy OwnerId')
				if (this.userType === 'Owner' || this.userType === 'Staff') {
					// console.log('id này số mấy', this.ownerId);
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
			// console.log('UserTyle là Owner', this.userType)
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
	dataListAll: any;
	getDataList(params: any) {
		this.loading = true;
		this.sizeService.getListSize({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 10000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng
		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				this.dataListAll = res?.data;
				console.info("===========[getDataList] ===========[res] : ", this.dataListAll);
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
		this.ownerService.getLists({ page: 1, pageSize: 100, ownerId: this.ownerId }).subscribe((res: any) => {
			console.info("===========[Brands] ===========[res] : ", res);
			if (res?.data) {
				this.owners = res?.data;
			}
		})
	}
	createItem() {
		this.modalTitle = 'Create Size';
		this.openModal = true;
		this.typeForm = 1;
	}
	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}
	search() {
		if (this.userType === 'Owner' || this.userType === 'Staff') {
			console.log('chay', this.formSearch.value.name);
			this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value });
		}
	}
	resetSearchForm() {
		this.formSearch.reset();
		this.getDataList({ ...this.paging, pageSize: 10000 })
	}
	saveItem(data: any) {
		if (this.typeForm == 1) {
			const form = { ...data.form, ownerId: this.ownerId };
			this.loading = true;
			console.log('form data', form)
			console.log('form data 2', data.form)
			this.sizeService.create(form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data || res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 1000 });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Size failed!");
				}
			})
		} else {
			this.loading = true;
			const form = { ...this.selected, ...data.form };
			let dataForm = data?.form;
			console.log('form data 2', form)
			this.sizeService.UpdateData(form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data || res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Size failed!");
				}
			})
		}
	}
	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.sizeId === id);
		console.log('view', data);
		this.selected = { ...data };
		this.modalTitle = 'View Size';
		this.openModal = true;
		this.typeForm = 2;
	}
	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.sizeId === id);
		console.log('edit', data);
		this.selected = { ...data };
		this.modalTitle = 'Edit Size';
		this.openModal = true;
		this.typeForm = 3;

	}
	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Product size',
			'Are you sure you want to delete this Size?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.sizeService.deleteDataSize(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Size deleted failed!");
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
				let totalSearch = this.dataListAll?.filter((item: any) => item?.name?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.name?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			// this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}
}
