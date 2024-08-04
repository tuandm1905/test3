import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { OwnerService } from '../../services/owner.service';
import { ServiceService } from '../../services/service.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';

@Component({
	selector: 'app-blog-admin-page',
	templateUrl: './blog-admin-page.component.html',
	styleUrls: ['./blog-admin-page.component.scss']
})
export class BlogAdminPageComponent {
	dataList: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	ownerId: number | null = null;
	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;
	userType: string = '';
	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private blogService: BlogService,
		private alertService: AlertService,
		private serviceService: ServiceService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private staffService: StaffService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Blog',
			link: '/owner/blog'
		}
	];
	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
	ngOnInit(): void {
		const user = this.authenService.getUser();
this.userType = user?.userType ?? '';
this.ownerId = user?.id ?? null;

if (this.userType === 'Staff') {
    this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        console.log('ID của Owner:', this.ownerId);
        console.log('Lấy ID của Staff xong lấy OwnerId');

        if (this.userType === 'Owner' || this.userType === 'Staff') {
            console.log('ID này số mấy:', this.ownerId);
            this.getDataList({
                searchQuery: null,
                page: this.paging,
                pageSize: 10000,
                ownerId: this.ownerId
            });
        }
    });
} else {
    console.log('UserType là:', this.userType);
    this.getDataList({
        searchQuery: null,
        page: this.paging,
        pageSize: 10000,
        ownerId: this.ownerId
    });
}
	
	}

	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		console.log('data', params);
		this.blogService.getLists({
			searchQuery: this.formSearch.value.name,  // Truy vấn tìm kiếm
			page: 1,              // Số trang
			pageSize: 10000,         // Kích thước trang
			ownerId: this.ownerId // ID người dùng
		}).subscribe((res: any) => {
			this.loading = false;
			if (res?.data?.length > 0) {
				console.info("===========[getDataListBrand] ===========[res] : ", res);
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
					console.log('start:',start)
					console.log('end:',end)
				}
				this.paging.total = res?.data?.length || 0;
				
			}

		})
	}
	// Update dataList based on paging
	// updateDataList() {
	// 	if (this.dataListAll?.length > 0) {
	// 		let start = (this.paging.page - 1) * this.paging.pageSize;
	// 		let end = this.paging.page * this.paging.pageSize;
	// 		this.dataList = this.dataListAll.slice(start, end);
	// 	}
	// }
	services = []
	getServices() {
		this.serviceService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.services = res?.data || [];
				console.info("Services data received:", res.data); // Log received data
			}
		})
	}
	owners = []
	getOwners() {
		this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.owners = res?.data;
				console.info("Owners data received:", res.data); // Log received data
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
		this.selected = null;
	}

	search() {
		this.pageChanged(1);
		// this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			this.blogService.createOrUpdateData(data?.form).subscribe((res: any) => {
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
			dataForm.AdId = data.id;
			this.blogService.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
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
		const data = this.dataList.find((c: any) => c.adId === id);
		console.log(data);
		this.selected = { ...data };
		this.modalTitle = 'View Blog';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.adId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Blog';
		this.openModal = true;
		this.typeForm = 3;

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

