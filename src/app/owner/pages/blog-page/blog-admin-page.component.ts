import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
export class BlogAdminPageComponent implements OnInit {



  services: any[] = [];
  form: FormGroup;


  dataList: any = [];
  selectedBrand: any = null;
  ownerId: number | null = null;
  modalTitle: string = '';
  userType: string = '';


  createModal: boolean = false;
  showModal: boolean = false;
  openModal: boolean = false;
  pageName: string = 'accounts';
  loading = false;
  paging: any = { ...INIT_PAGING }
  typeForm = 0;
  breadCrumb: any = [
    { label: 'Owner', link: '/' },
    { label: 'Advertisements', link: '/owner/advertisements' }
  ];
  formSearch: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null)
  });

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private alertService: AlertService,
    private serviceService: ServiceService,
    private ownerService: OwnerService,
    private authenService: AuthenService,
    private staffService: StaffService
  ) { }

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    this.ownerId = user?.id ?? null;
    
    if (this.userType === 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        this.getDataList({
          searchQuery: null,
          page: this.paging.page,
          pageSize: this.paging.pageSize,
          ownerId: this.ownerId
        });
      });
    } else {
      this.getDataList({
        searchQuery: null,
        page: this.paging.page,
        pageSize: this.paging.pageSize,
        ownerId: this.ownerId
      });
    }

    this.loadServices();
  }

  loadServices() {
    this.serviceService.getLists({ page: 1, pageSize: 50 }).subscribe((res: any) => {
      if (res?.data) {
        this.services = res.data;
      }
    });
  }


  dataListAll = [];
  getDataList(params: any) {
    this.loading = true;
    this.blogService.getLists({
      searchQuery: this.formSearch.value.name,
      page: this.paging.page,
      pageSize: 100,
      ownerId: this.ownerId
    }).subscribe((res: any) => {
      this.loading = false;
        this.dataListAll = res?.data;
        // console.log('data all',this.dataListAll)
        if (this.dataListAll?.length > 0) {
          let start = (this.paging?.page - 1) * this.paging.pageSize;
          let end = this.paging?.page * this.paging.pageSize;
          this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
        }
        this.paging.total = res.data.length || 0;
    });
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
    this.search();
  }

  saveItem(data: any) {
    console.log('userType', this.typeForm)
    if (this.typeForm == 1) {
      this.loading = true;
      console.log('data onwerId', data.form.OwnerId)
      data.form.OwnerId = this.ownerId
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
    } else if (this.typeForm == 3) {
      this.loading = true;
      let dataForm = data?.form;
      delete (dataForm.password);
      // dataForm.AdId = data.id;
      // console.log('data', data.form)
      // console.log('data kakáksaksakksa', dataForm)
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
      this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
    }
  }
}
