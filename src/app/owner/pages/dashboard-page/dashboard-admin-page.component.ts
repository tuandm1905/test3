import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../admin/services/statistics.service';
import { StaffService } from '../../services/staff.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenService } from '../../../admin/services/authen.service';
import { INIT_PAGING } from '../../helpers/constant';
import { WarehouseService } from '../../services/warehouse.service';

@Component({
  selector: 'app-dashboard-admin-page',
  templateUrl: './dashboard-admin-page.component.html',
  styleUrls: ['./dashboard-admin-page.component.scss'] // Corrected property name styleUrls
})
export class DashboardAdminPageComponent implements OnInit {

  loading = false;

  breadCrumb: any = [
    {
      label: 'Owner',
      link: '/'
    },
    {
      label: 'Dashboard',
      link: '/owner/dashboard'
    }
  ];

  dashboardItems = [
    { title: 'Staff', description: 'Total Account Staff', value: 0, formattedValue: '', link: '/owner/account', class: 'box p-3 mb-2' },
    { title: 'Advertisement', description: 'Total Advertisement', value: 0, formattedValue: '', link: '/owner/blog', class: 'box p-3 mb-2' },
    { title: 'Product', description: 'Total Product', value: 0, formattedValue: '', link: '/owner/product', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Total Orders', value: 0, formattedValue: '', link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Successful Orders', value: 0, formattedValue: '', link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Failed Orders', value: 0, formattedValue: '', link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Canceled Orders', value: 0, formattedValue: '', link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Total Revenue', value: 0, formattedValue: '', link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Consultation', description: 'Total Guest Consultation', value: 0, formattedValue: '', link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Voucher', description: 'Total Quantity Voucher Used', value: 0, formattedValue: '', link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Voucher', description: 'Total Price Voucher Used', value: 0, formattedValue: '', link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Warehouse', description: 'Total Warehouse', value: 0, formattedValue: '', link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Import Product', description: 'Total Import Product', value: 0, formattedValue: '', link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Import Product', description: 'Total Quantity By Import', value: 0, formattedValue: '', link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
  ];

  accountUser: any;
  orderStatistics: any;
  blogStatistics: any;
  productStatistics: any;
  top5Statistics: any;
  guestStatistics: any;
  voucherStatistics: any;
  wưarehouseStatistics: any;
  importproductStatistics: any;
  formSearch: any = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null)
  });

  ownerId: number | null = null;
  userType: string = '';
  paging: any = { ...INIT_PAGING };
  dataList: any = [];

  constructor(
    private statisticsService: StatisticsService,
    private staffService: StaffService,
    private authenService: AuthenService,
    private warehouseService: WarehouseService,
  ) { }

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    if (this.userType == 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        console.log('ID của Owner', this.ownerId);
        console.log('Lấy ID của Staff xong lấy OwnerId');
        this.getStatistics(this.ownerId);
      });
    } else {
      console.log('UserType là Owner', this.userType);
      this.ownerId = user?.id ?? null;  // Ensure ownerId is set for Owner type
      this.getStatistics(this.ownerId);
    }
  }

  filteredDashboardItems() {
    if (this.userType === 'Staff') {
      return this.dashboardItems.filter(item => item.title !== 'Staff');
    }
    return this.dashboardItems;
  }

  getStatistics(idOwner: number | null): void {
    if (!this.ownerId) {
      console.error('Owner ID is not available');
      return;
    }
    this.loading = true;

    this.statisticsService.guestconsultation({}).subscribe(
      (data: any) => {
        this.guestStatistics = data;
        console.log('data guest 12312312312', this.guestStatistics)
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error: any) => {
        console.error('Error fetching Guest statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.blog(this.ownerId).subscribe(
      (data: any) => {
        this.blogStatistics = data;
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error: any) => {
        console.error('Error fetching blog statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.orderOwner(this.ownerId).subscribe(
      (data: any) => {
        this.orderStatistics = data;
        this.updateDashboardItems(); // Update dashboard items after order data is received
      },
      (error: any) => {
        console.error('Error fetching order statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.product(this.ownerId).subscribe(
      (data: any) => {
        this.productStatistics = data;
        this.updateDashboardItems(); // Update dashboard items after product data is received
      },
      (error: any) => {
        console.error('Error fetching product statistics', error);
        this.loading = false;
      }
    );
    this.statisticsService.VoucherStatistics(this.ownerId).subscribe(
      (data: any) => {
        this.voucherStatistics = data;
        console.log('VoucherStatistics', this.voucherStatistics);
        this.updateDashboardItems(); // Update dashboard items after product data is received
      },
      (error: any) => {
        console.error('Error fetching product statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.WarehouseDetail(this.ownerId).subscribe(
      (data: any) => {
        this.wưarehouseStatistics = data;
        console.log('wưarehouseStatistics', this.wưarehouseStatistics)
        this.updateDashboardItems(); // Update dashboard items after product data is received
      },
      (error: any) => {
        console.error('Error fetching product statistics', error);
        this.loading = false;
      }
    );

    this.warehouseService.getLists(this.ownerId).subscribe(
      (res: any) => {
        const warehouseId = res?.data?.warehouseId;

        this.statisticsService.importproduct({ warehouseId, importId: null, ownerId: this.ownerId }).subscribe(
          (data: any) => {
            this.importproductStatistics = data;
            console.log('importproductStatistics', this.importproductStatistics)
            this.updateDashboardItems(); // Update dashboard items after product data is received
          },
          (error: any) => {
            console.error('Error fetching product statistics', error);
            this.loading = false;
          }
        );
      }
    )
    this.staffService.getLists({
      searchQuery: this.formSearch.value.name,  // Search query
      page: 1,              // Page number
      pageSize: 100,         // Page size
      ownerId: this.ownerId // Owner ID
    }).subscribe((res: any) => {
      this.loading = false;
      if (res?.data?.length > 0) {
        this.dataList = res.data;
        console.error('Staff', this.dataList);
        this.paging.total = res.data.length || 0;
      }
      this.updateDashboardItems();
    });

    this.statisticsService.productTop5(this.ownerId).subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          this.top5Statistics = data.map((item: any) => ({
            name: item.name,
            image: item.images && item.images[0] ? item.images[0].linkImage : 'default-image-url' // Đảm bảo rằng hình ảnh tồn tại
          }));
        } else {
          console.log('No top 5 products found.');
        }
      },
      (error: any) => {
        console.error('Error fetching top 5 products:', error);
      }
    );
    console.log('data name', this.top5Statistics.name);
    console.log('data name', this.top5Statistics.image[0].linkImage);



  }

 
  formatCurrency(value: number, addCurrency: boolean = false): string {
    if (addCurrency) {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  }
  shouldAddCurrency(title: string): boolean {
    const titlesWithCurrency = ['Total Revenue', 'Total Price Voucher Used']; // Add titles here
    return titlesWithCurrency.includes(title);
  }

  updateDashboardItems(): void {
    if (this.dataList) {
      this.dashboardItems[0].value = this.dataList.length;
      this.dashboardItems[1].value = this.blogStatistics.totalOwnerAdversisement;
      this.dashboardItems[2].value = this.productStatistics.length;
      this.dashboardItems[3].value = this.orderStatistics.totalOrders;
      this.dashboardItems[4].value = this.orderStatistics.successfulOrders;
      this.dashboardItems[5].value = this.orderStatistics.failedOrders;
      this.dashboardItems[6].value = this.orderStatistics.canceledOrders;
      this.dashboardItems[7].formattedValue = this.formatCurrency(this.orderStatistics.totalRevenue, true);
      this.dashboardItems[8].value = this.guestStatistics.message;
      this.dashboardItems[9].value = this.voucherStatistics.totalQuantityVoucherUsed;
      this.dashboardItems[10].formattedValue = this.formatCurrency(this.voucherStatistics.totalPriceVoucherUsed, true);
      this.dashboardItems[11].value = this.wưarehouseStatistics.message;
      this.dashboardItems[12].value = this.importproductStatistics.totalImportProduct;
      this.dashboardItems[13].formattedValue = this.formatCurrency(this.importproductStatistics.totalQuantityByImport, true);

      this.loading = false; // Set loading to false after updating dashboard
    }
  }

}
