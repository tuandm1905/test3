import { Component } from '@angular/core';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { ImportproductService } from '../../services/importproduct.service';
import { WarehouseService } from '../../services/warehouse.service';
import { Router } from 'express';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-import-detail',
  templateUrl: './import-detail.component.html',
  styleUrl: './import-detail.component.scss'
})
export class ImportDetailComponent {
  dataList: any = [];
  userType: string = '';
  pageName: string = 'accounts';
  paging: any = { ...INIT_PAGING }
  loading = false;
  ownerId: number | null = null;
  currentPage: number = 1;
  totalPages: number = 5;
  id: number | null = null;
  breadCrumb: any = [
    { label: 'Owner', link: '/' },
    { label: 'Import Detail', link: '/owner/import-detail' }
  ];

  constructor(
    private alertService: AlertService,
    private ownerService: OwnerService,
    private authenService: AuthenService,
    private staffService: StaffService,
    private importSerivce: ImportproductService,
    private warehouseSerivce: WarehouseService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      console.log('Received ID:', this.id);
      // Gọi hàm để lấy dữ liệu dựa trên ID nếu cần
      this.getDataList(this.id);
    });
  }
  dataListAll = [];
  getDataList(id: number) {
      this.loading = true;
      this.importSerivce.getListImportId(id).subscribe((res: any) => {
        this.loading = false;
        this.dataListAll = res?.data;
        if (this.dataListAll?.length > 0) {
          let start = (this.paging?.page - 1) * this.paging.pageSize;
          let end = this.paging?.page * this.paging.pageSize;
          this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
        }
        console.log('data', this.dataList);
        this.paging.total = res?.data.length || 0;
      });
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
