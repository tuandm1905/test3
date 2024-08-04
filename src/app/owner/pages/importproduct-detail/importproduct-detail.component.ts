import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { SizeService } from '../../services/size.service';

@Component({
	selector: 'app-importproduct-detail',
	templateUrl: './importproduct-detail.component.html',
	styleUrl: './importproduct-detail.component.scss'
})
export class ImportproductDetailComponent {
	ownerId: number | null = null;
	userType: string = '';
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
		private productService: ProductService,
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private staffService: StaffService,
		private sizeService: SizeService
	) {

	}
	product = [];
	size = [];
	products = ['Product 1', 'Product 2', 'Product 3'];
	sizes = ['Small', 'Medium', 'Large'];
	rows = Array.from({ length: 10 }, () => ({ product: '', size: '', price: 0, quantity: 0 }));
	origin: string = '';

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;

		if (this.userType === 'Staff') {
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Owner:', this.ownerId);
				console.log('Lấy ID của Staff xong lấy OwnerId');

				// Gọi hàm getDataRelation với ownerId đã được cập nhật
				this.getDataRelation(this.ownerId);
			});
		} else {
			console.log('UserType là:', this.userType);

			// Gọi hàm getDataRelation với ownerId mặc định
			this.getDataRelation(this.ownerId);
		}

	}

	getDataRelation(ownerId: number | null) {
		this.sizeService.getListSize({ page: 1, pageSize: 100, ownerId }).subscribe((res: any) => {
			if (res?.data) {
				this.size = res.data.map((item: any) => ({ id: item.id, name: item.name }));
			}
		});

		this.productService.getLists(ownerId).subscribe((res: any) => {
			this.product = res.map((item: any) => ({ id: item.id, name: item.name }));
		});
	}

	save() {
		// Implement save logic here
		console.log('Data to be saved:', {
			rows: this.rows,
			origin: this.origin
		});
	}
	addRow() {
		this.rows.push({ product: '', size: '', price: 0, quantity: 0 });
	}

	removeRow(index: number) {
		if (this.rows.length > 1) {
			this.rows.splice(index, 1);
		}
	}


	isRowDisabled(index: number): boolean {
		if (index === 0) {
			return false; // Always allow editing for the first row
		}

		const prevRow = this.rows[index - 1];
		const isPreviousRowComplete = prevRow.product && prevRow.size;

		return !isPreviousRowComplete;
	}

}
