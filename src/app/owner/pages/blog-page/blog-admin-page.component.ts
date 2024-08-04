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
  owners: any[] = [];
  dataList: any[] = []; // Initialize as an empty array
  selected: any = null;
  form: FormGroup;
  ownerId: number | null = null;
  openModal: boolean = false;
  modalTitle: string = '';
  typeForm: number = 0;
  userType: string = '';
  paging: any = { ...INIT_PAGING }
  loading = false;
  breadCrumb: any = [
    { label: 'Owner', link: '/' },
    { label: 'Blog', link: '/owner/blog' }
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
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      Title: ['', Validators.required],
      services: [null, Validators.required],
      Image: ['', Validators.required],
      Content: ['', Validators.required]
    });

    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    this.ownerId = user?.id ?? null;

    if (this.userType === 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        this.loadBlogs();
      });
    } else {
      this.loadBlogs();
    }

    this.loadServices();
    this.loadOwners();
  }

  loadBlogs() {
    this.getDataList({
      searchQuery: null,
      page: this.paging.page,
      pageSize: this.paging.pageSize,
      ownerId: this.ownerId
    });
  }

  loadServices() {
    this.serviceService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
      if (res?.data) {
        this.services = res.data;
      }
    });
  }

  loadOwners() {
    this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
      if (res?.data) {
        this.owners = res.data;
      }
    });
  }

  getDataList(params: any) {
    this.loading = true;
    this.blogService.getLists({
      searchQuery: this.formSearch.value.name,
      page: this.paging.page,
      pageSize: this.paging.pageSize,
      ownerId: this.ownerId
    }).subscribe((res: any) => {
      this.loading = false;
      if (res?.data?.length > 0) {
        this.dataList = res.data;
        this.paging.total = res.data.length || 0;
      }
    });
  }

  createItem() {
    this.typeForm = 2; // Chế độ tạo mới
    this.openModal = true;
    this.modalTitle = 'Create New Blog';
    this.form.reset();
  }

  closeModal() {
    this.openModal = false;
    this.typeForm = 0;
    this.selected = null;
  }

  search() {
    this.pageChanged(1);
  }

  resetSearchForm() {
    this.formSearch.reset();
    this.search();
  }

  saveItem(data: any) {
    if (!this.form.valid) return;

    this.loading = true;
    const blogData = {
      ...this.form.value,
      AdId: this.selected?.adId || undefined
    };

    this.blogService.createOrUpdateData(blogData, this.selected?.adId).subscribe((res: any) => {
      this.loading = false;
      if (res?.data) {
        this.alertService.fireSmall('success', res?.message);
        this.closeModal();
        this.loadBlogs();
      } else if (res?.errors) {
        this.alertService.showListError(res?.errors);
      } else {
        this.alertService.fireSmall('error', res?.message || (this.typeForm === 2 ? "Add Blog failed!" : "Update Blog failed!"));
      }
    });
  }

  viewItem(id: number) {
    const data = this.dataList.find((c: any) => c.adId === id);
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
    this.form.patchValue(data);
  }

  pageChanged(e: any) {
    this.paging.page = e;
    this.loadBlogs();
  }
}
