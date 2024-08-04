import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { OwnerService } from '../../services/owner.service';
import { ServiceService } from '../../services/service.service';

@Component({
	selector: 'app-blog-admin-page',
	templateUrl: './blog-admin-page.component.html',
	styleUrls: ['./blog-admin-page.component.scss']
})
export class BlogAdminPageComponent {
	dataList: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;

	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private blogService: BlogService,
		private alertService: AlertService,
		private serviceService: ServiceService,
		private ownerService: OwnerService,
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Blog',
			link: '/admin/blog'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging, pageSize: 1000 });
	}

	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		console.log('data', params);
		this.blogService.getLists(params).subscribe((res: any) => {
			this.loading = false;
			if (res?.data) {
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
				}
				console.log('du lieu chinh',this.dataList)
				this.paging.total = res?.data?.length || 0;
			}
		})
	}
	updateDataList() {
		if (this.dataListAll?.length > 0) {
			let start = (this.paging.page - 1) * this.paging.pageSize;
			let end = this.paging.page * this.paging.pageSize;
			this.dataList = this.dataListAll.slice(start, end);
		}
	}
	services = []
	getServices() {
		this.serviceService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.services = res?.data || [];
				console.info("Services data received:", res.data); 
			}
		})
	}
	owners = []
	getOwners() {
		this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.owners = res?.data;
				console.info("Owners data received:", res.data); 
			}
		})
	}


	
	createItem() {
		this.modalTitle = 'Create Owner';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;
	}

	search() {
		this.pageChanged(1);
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.getDataList({ ...this.paging, pageSize: 1000 });
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
		console.log('data',data);
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
	updateBlogStatus(adId: number, statusPostId: string) {
		console.log('du lieu',adId,',',statusPostId)
        this.blogService.updateStatus(adId, statusPostId).subscribe((res: any) => {
            if (res?.data) {
                this.alertService.fireSmall('success', res?.message);
                this.getDataList({ page: 1, pageSize: 1000 });
            } else if (res?.errors) {
                this.alertService.showListError(res?.errors);
            } else {
                this.alertService.fireSmall('error', res?.message || 'Update status failed!');
            }
        });
    }
	  
	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null),
		searchQuery: new FormControl(null) 
	});

	pageChanged(e: any) {
		this.paging.page = e;
	
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
	
			if (this.formSearch.value?.searchQuery) {
				let searchQuery = this.formSearch.value.searchQuery.trim().toLowerCase();
				let totalSearch = this.dataListAll.filter((item: any) =>
					(item?.title?.toLowerCase().includes(searchQuery) ||
					 item?.ownerName?.toLowerCase().includes(searchQuery))
				);
				this.paging.total = totalSearch.length;
				this.dataList = totalSearch.slice(start, end);
			} else {
				this.dataList = this.dataListAll.slice(start, end);
			}
		}
	}
	


}

