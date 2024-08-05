import { Component } from '@angular/core';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { WarehouseService } from '../../services/warehouse.service';
import { FormControl, FormGroup } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { ProductService } from '../../services/product.service';

@Component({
	selector: 'app-warehouse-page',
	templateUrl: './warehouse-page.component.html',
	styleUrl: './warehouse-page.component.scss'
})
export class WarehousePageComponent {
	dataList: any = [];
	dataListAll: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	ownerId: number | null = null;
	totalPrice: number | null = null;
	totalQuantity: number | null = null;
	userType: string = '';
	editingIndex: number | null = null; // Theo dõi chỉ số của dòng đang chỉnh sửa
	originalLocation: string = ''; // Để lưu vị trí gốc trước khi chỉnh sửa
	warehouseId: number | null = null;
	createModal: boolean = false;
	showModal: boolean = false;
	updateModal: boolean = false;
	openModal: boolean = false; // Mặc định là false hoặc giá trị khởi tạo khác

	pageName: string = 'warehouse';
	paging: any = { ...INIT_PAGING }
	loading = false;
	typeForm = 0;

	constructor(
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private warehouseService: WarehouseService,
		private staffService: StaffService,
		private productSize: ProductService
	) { }

	breadCrumb: any = [
		{
			label: 'Warehouse',
			link: '/'
		},
		{
			label: 'Warehouse',
			link: '/owner/warehouse'
		}
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;
		// this.getListProductSize(1, 10); 
		if (this.userType === 'Staff') {
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				this.loadWarehouseIdAndData();
			});
		} else {
			this.loadWarehouseIdAndData();
		}
	}

	loadWarehouseIdAndData() {
		this.warehouseService.getLists(this.ownerId).subscribe((res: any) => {
			this.warehouseId = res?.data?.warehouseId;
			console.log('warehouseId', this.warehouseId);
			if (this.warehouseId) {
				this.getDataList({ ...this.paging, pageSize: 100, warehouseId: this.warehouseId });
			} else {
				this.alertService.fireSmall('error', 'Không thể lấy Warehouse ID.');
			}
		}, (error) => {
			console.error('Không thể lấy Warehouse ID:', error);
			this.alertService.fireSmall('error', 'Không thể lấy Warehouse ID.');
		}
	);
	}

	getDataList(params: any) {
		if (!this.warehouseId) {
			this.alertService.fireSmall('error', 'Warehouse ID không khả dụng.');
			return;
		}

		this.loading = true;
		this.warehouseService.getListWarehouse(params, this.warehouseId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res?.data;
			this.totalPrice =  res.totalPrice
			this.totalQuantity = res.totalQuantity
			console.log('Số tổng', this.totalPrice, ',', this.totalQuantity)
			console.log('Dữ liệu', this.dataListAll)
			if (this.dataListAll.length > 0) {
				let start = (this.paging.page - 1) * this.paging.pageSize;
				let end = this.paging.page * this.paging.pageSize;
				this.dataList = this.dataListAll.slice(start, end);
				this.paging.total = res?.data?.totalCount || this.dataListAll.length;
			} else {
				this.dataList = [];
				this.paging.total = 0;
			}
		}, (error) => {
			this.loading = false;
			console.error('Không thể tải danh sách dữ liệu:', error);
			this.alertService.fireSmall('error', 'Không thể tải danh sách dữ liệu.');
		});
	}

	dataListSize: any = [];
	// getListProductSize(page: number, pageSize: number) {
	// 	this.loading = true;
	// 	this.warehouseService.getListSize({
	// 		page,
	// 		pageSize,
	// 		ownerId: this.ownerId
	// 	}).subscribe(
	// 		(res: any) => {
	// 			this.loading = false;
	// 			if (res?.data?.length > 0) {
	// 				this.dataListSize = res?.data;
	// 				console.log('Danh sách kích thước', this.dataListSize);
	// 			} else {
	// 				console.log('Không tìm thấy kích thước');
	// 			}
	// 		},
	// 		(error) => {
	// 			this.loading = false;
	// 			console.error('Không thể tải kích thước sản phẩm:', error);
	// 			this.alertService.fireSmall('error', 'Không thể tải kích thước sản phẩm.');
	// 		}
	// 	);
	// }

	createItem() {
		this.modalTitle = 'Create Warehouse';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;
	}

	search() {
		// Validate form before search
		if (this.formSearch.invalid) {
		  this.alertService.fireSmall('error', 'Please provide valid search criteria.');
		  return;
		}
	  
		// Ensure userType is valid for searching
		if (this.userType === 'Owner' || this.userType === 'Staff') {
		  // Reset pagination to the first page
		  this.paging.page = 1;
	  
		  // Retrieve search term
		  const searchTerm = this.formSearch.value.name?.toLowerCase().trim();
	  
		  // If search term exists, filter dataListAll by productName
		  if (searchTerm) {
			const filteredData = this.dataListAll.filter((item: any) =>
			  item.productName?.toLowerCase().includes(searchTerm)
			);
	  
			// Set the filtered data and pagination total
			this.dataList = filteredData.slice(0, this.paging.pageSize);
			this.paging.total = filteredData.length;
		  } else {
			// If no search term, reset the dataList with full data
			this.dataList = this.dataListAll.slice(0, this.paging.pageSize);
			this.paging.total = this.dataListAll.length;
		  }
		}
	  }
	  
	

	resetSearchForm() {
		this.loadWarehouseIdAndData();
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (!this.warehouseId) {
			this.alertService.fireSmall('error', 'Warehouse ID không khả dụng cho thao tác lưu.');
			return;
		}

		if (this.modalTitle === 'Create Warehouse') {
			this.loading = true;
			this.warehouseService.createOrUpdateData({ ...data?.form, warehouseId: this.warehouseId }).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10, warehouseId: this.warehouseId });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Thêm sản phẩm thất bại!");
				}
			});
		} else {
			this.loading = true;
			this.warehouseService.createOrUpdateData({ ...data?.form, warehouseId: this.warehouseId }, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10, warehouseId: this.warehouseId });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Cập nhật sản phẩm thất bại!");
				}
			});
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.warehouseId === id);
		this.selected = data;
		this.modalTitle = 'Chi tiết Warehouse';
		this.typeForm = 2;
		this.openModal = true;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.warehouseId === id);
		this.selected = { ...data };
		this.modalTitle = 'Chỉnh sửa Warehouse';
		this.openModal = true;
		this.typeForm = 3
	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Xóa sản phẩm',
			'Bạn có chắc chắn muốn xóa sản phẩm này không?',
			'warning',
			'Hủy',
			'Xóa',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.warehouseService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Sản phẩm đã được xóa thành công') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10, warehouseId: this.warehouseId });
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Xóa sản phẩm thất bại!");
						}
					});
				}
			});
	}

	startEdit(index: number) {
		this.editingIndex = index;
		this.originalLocation = this.dataList[index].location; // Lưu vị trí gốc
	}

	saveEdit(id: number) {
		if (!this.warehouseId) {
			this.alertService.fireSmall('error', 'Warehouse ID is not available for update.');
			return;
		}
	
		if (this.editingIndex !== null && this.editingIndex >= 0) {
			// Get the item being edited
			const editingItem = this.dataList[this.editingIndex];
	
			// Ensure that ProductSizeId has a value
			if (!editingItem.productSizeId) {
				this.alertService.fireSmall('error', 'ProductSizeId cannot be empty!');
				return;
			}
	
			const updatedLocation = editingItem.location;
			const warehouseDetailDTO = {
				warehouseId: this.warehouseId,
				productSizeId: editingItem.productSizeId, // Ensure ProductSizeId is sent
				location: updatedLocation,
				// Add other necessary fields if needed
			};
	
			this.warehouseService.updateLocation(warehouseDetailDTO).subscribe((res: any) => {
				if (res?.message.includes('successfully')) {
					this.alertService.fireSmall('success', 'Location updated successfully!');
					this.editingIndex = null;
				} else {
					this.alertService.fireSmall('error', 'Failed to update location.');
				}
			}, (error) => {
				console.error('Error updating location:', error);
				this.alertService.fireSmall('error', 'Failed to update location.');
			});
		} else {
			this.alertService.fireSmall('error', 'No item is being edited.');
		}
	}
	
	
	
	
	cancelEdit() {
		if (this.editingIndex !== null) {
			this.dataList[this.editingIndex].location = this.originalLocation;
			this.editingIndex = null;
		}
	}

	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	pageChanged(e: any) {
		this.paging.page = e;
	  
		// Calculate start and end indices for pagination
		let start = (this.paging.page - 1) * this.paging.pageSize;
		let end = this.paging.page * this.paging.pageSize;
	  
		// Check if the search term is provided
		if (this.formSearch.value?.name) {
		  let searchTerm = this.formSearch.value.name.toLowerCase().trim();
	  
		  // Filter the list based on productName
		  let filteredData = this.dataListAll.filter((item: any) =>
			item.productName?.toLowerCase().includes(searchTerm)
		  );
	  
		  // Set the total number of filtered items
		  this.paging.total = filteredData.length;
	  
		  // Slice the filtered list based on current pagination
		  this.dataList = filteredData.slice(start, end);
		} else {
		  // If no search term, use all items for pagination
		  this.paging.total = this.dataListAll.length;
		  this.dataList = this.dataListAll.slice(start, end);
		}
	  }
	  
	
}
