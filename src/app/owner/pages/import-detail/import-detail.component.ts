import { Component } from '@angular/core';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { ImportproductService } from '../../services/importproduct.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-import-detail',
  templateUrl: './import-detail.component.html',
  styleUrl: './import-detail.component.scss'
})
export class ImportDetailComponent {
  dataList: any = [];
  dataListAll: any = [];
  editingIndex: number | null = null;
  userType: string = '';
  paging: any = { ...INIT_PAGING };
  loading = false;
  ownerId: number | null = null;
  importId: number | null = null;
  id: number | null = null;
  breadCrumb: any = [
    { label: 'Owner', link: '/' },
    { label: 'Import Detail', link: '/owner/import-detail' }
  ];

  constructor(
    private alertService: AlertService,
    private authenService: AuthenService,
    private staffService: StaffService,
    private importService: ImportproductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authenService.getUser();
		this.ownerId = user?.id ?? null;
    this.route.paramMap.subscribe(params => {
      this.importId = Number(params.get('id'));
      this.getDataList(this.importId);
    });
  }

  getDataList(id: number) {
    
    this.loading = true;
    this.importService.getListImportId(id).subscribe((res: any) => {
      this.loading = false;
      this.dataListAll = res?.data;
      if (this.dataListAll?.length > 0) {
        this.updateDisplayedData();
      }
      this.paging.total = this.dataListAll.length || 0;
    });
  }

  updateDisplayedData() {
    let start = (this.paging.page - 1) * this.paging.pageSize;
    let end = this.paging.page * this.paging.pageSize;
    this.dataList = this.dataListAll.slice(start, end);
  }

  pageChanged(e: any) {
    this.paging.page = e;
    this.updateDisplayedData();
  }

  startEdit(index: number) {
    this.editingIndex = index;
  }

  saveEdit(item: any) {
    if (!this.ownerId || !this.importId) {
      this.alertService.fireSmall('error', 'Missing owner or import ID.');
      return;
    }

    // Prepare the data for the API request
    const updateDetails = [
      {
        importId: item.importId,
        productSizeId: item.productSizeId,
        quantityReceived: item.quantityReceived,
        unitPrice: item.unitPrice
      }
    ];

    this.importService.updateImportProductDetail(this.ownerId, this.importId, updateDetails).subscribe(
      (res: any) => {
        this.alertService.fireSmall('success', 'Changes saved successfully!');
        this.editingIndex = null;
      },
      (error) => {
        console.error('Error saving changes:', error);
        this.alertService.fireSmall('error', 'Failed to save changes.');
      }
    );
  }

  cancelEdit() {
    // Optionally refresh the data to reset the changes
    if (this.id) {
      this.getDataList(this.id);
    }
    this.editingIndex = null;
  }
}
