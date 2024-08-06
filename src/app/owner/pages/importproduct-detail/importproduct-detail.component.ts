import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { SizeService } from '../../services/size.service';
import { ImportproductService } from '../../services/importproduct.service';
import { WarehouseService } from '../../services/warehouse.service';

@Component({
  selector: 'app-importproduct-detail',
  templateUrl: './importproduct-detail.component.html',
  styleUrls: ['./importproduct-detail.component.scss']
})
export class ImportproductDetailComponent implements OnInit {
  ownerId: number | null = null;
  warehouseId: number | null = null;
  userType: string = '';
  form: FormGroup;
  breadCrumb: any = [
    {
      label: 'Owner',
      link: '/'
    },
    {
      label: 'Import Product Detail',
      link: '/owner/importproduct-detail'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private alertService: AlertService,
    private ownerService: OwnerService,
    private authenService: AuthenService,
    private staffService: StaffService,
    private sizeService: SizeService,
    private importSerivce: ImportproductService,
    private warehouseSerivce: WarehouseService,
  ) {
    this.form = this.fb.group({
      origin: new FormControl('', Validators.required), // Add origin field to FormGroup
      rows: this.fb.array([this.createRow()]) // Initialize with one row
    });
  }

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    this.ownerId = user?.id ?? null;

    if (this.userType === 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        this.getDataRelation(this.ownerId);
      });
    } else {
      this.getDataRelation(this.ownerId);
    }
  }

  product = [];
  size = [];
  getDataRelation(ownerId: number | null) {
    this.sizeService.getListSize({ page: 1, pageSize: 100, ownerId }).subscribe((res: any) => {
      if (res?.data) {
        this.size = res.data;
      }
    });

    this.productService.getLists(ownerId).subscribe((res: any) => {
      this.product = res;
    });
  }

  createRow(): FormGroup {
    return this.fb.group({
      product: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    if (this.isCurrentRowComplete()) {
      this.rows.push(this.createRow());
    } else {
      this.alertService.fireSmall('warning', 'Please complete the current row before adding a new one.');
    }
  }

  removeRow(index: number) {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
    }
  }

  isRowDisabled(index: number): boolean {
    if (index === 0) {
      return false; // Always allow editing for the first row
    }
    const prevRow = this.rows.at(index - 1);
    return !prevRow.valid;
  }

  isCurrentRowComplete(): boolean {
    const currentRow = this.rows.at(this.rows.length - 1);
    return currentRow.valid;
  }

  save() {
    console.log('Data to be saved:', this.form.value);
    if (this.form.valid) {
      const dataToSave = {
        importProductDetailDTO: this.form.value.rows.map((row: any) => ({
          productId: row.product,
          sizeId: row.size,
          quantityReceived: row.quantity,
          unitPrice: row.price
        })),
        origin: this.form.value.origin
      };

      console.log('Data to be saved:', dataToSave);

      // Show confirmation dialog before saving
      this.alertService.fireConfirm(
        'Confirm Import',
        'Are you sure you want to import these details?',
        'warning',
        'Cancel',
        'Import'
      ).then((result) => {
        if (result.isConfirmed) {
          // Get warehouseId before calling the API
          this.warehouseSerivce.getLists(this.ownerId).subscribe((res: any) => {
            this.warehouseId = res?.data?.warehouseId;

            if (this.ownerId && this.warehouseId) {
              this.importSerivce.create(this.ownerId, this.warehouseId, dataToSave.origin, dataToSave.importProductDetailDTO).subscribe(
                (res: any) => {
                  if (res?.message.includes('successfully')) {
                    this.alertService.fireSmall('success', res?.message);
                    this.resetForm(); // Reset form after successful save
                  } else if (res?.errors) {
                    this.alertService.showListError(res?.errors);
                  } else {
                    this.alertService.fireSmall('error', res?.message || 'Product update failed!');
                  }
                },
                (error) => {
                  console.error('Error:', error);
                  this.alertService.fireSmall('error', 'Failed to save data. Please try again.');
                }
              );
            } else {
              this.alertService.fireSmall('error', 'Missing Owner ID or Warehouse ID.');
            }
          });
        }
      });
    } else {
      this.alertService.fireSmall('error', 'Please complete all rows before saving.');
    }
  }

  resetForm() {
    // Reset form values to defaults
    this.form.reset();
    // Clear old rows and add a new empty row
    this.rows.clear();
    this.rows.push(this.createRow());
  }
}
