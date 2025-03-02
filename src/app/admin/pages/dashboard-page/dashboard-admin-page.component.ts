import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-dashboard-admin-page',
  templateUrl: './dashboard-admin-page.component.html',
  styleUrls: ['./dashboard-admin-page.component.scss']
})
export class DashboardAdminPageComponent implements OnInit {

  loading = false;
  
  breadCrumb: any = [
    {
      label: 'Admin',
      link: '/'
    },
    {
      label: 'Dashboard',
      link: '/admin/dashboard'
    }
  ];
  
  dashboardItems = [
    { title: 'User', description: 'Total', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'User', description: 'Total Account Banned', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'Owner', description: 'Total Account', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'Owner', description: 'Total Account Banned', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'Advertisement', description: 'Total Advertisement', value: 0, link: '/admin/blog', class: 'box p-3 mb-2' },
    { title: 'Product', description: 'Total Product', value: 0, link: '/admin/product', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Total Orders', value: 0, link: '/admin/dashboard', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Success Full Orders', value: 0, link: '/admin/dashboard', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Failed Orders', value: 0, link: '/admin/dashboard', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Canceled Orders', value: 0, link: '/admin/dashboard', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Total Revenue', value: 0, formattedValue: '',link: '/admin/dashboard', class: 'box p-3 mb-2' },
    // { title: 'Doanh thu', description: 'Tổng doanh thu tháng này', value: 0, link: '/admin/dashboard', class: 'box p-3 mb-2' }
  ];

  accountUser: any;
  blogStatistics: any;
  orderStatistics: any
  top10Statistics: any;
  productadminStatistics:any;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.getStatistics();
  }

  getStatistics(): void {
    this.loading = true;

    this.statisticsService.account({}).subscribe(
      (data) => {
        this.accountUser = data;
        console.log('data',this.accountUser)
        this.updateDashboardItems(); // Update dashboard items after account data is received
      },
      (error) => {
        console.error('Error fetching account statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.blog(1).subscribe(
      (data) => {
        this.blogStatistics = data;
        console.log('data',this.blogStatistics)
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error) => {
        console.error('Error fetching blog statistics', error);
        this.loading = false;
      }
    );
    this.statisticsService.order({}).subscribe(
      (data) => {
        this.orderStatistics = data;
        console.log('data',this.orderStatistics)
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error) => {
        console.error('Error fetching blog statistics', error);
        this.loading = false;
      }
    );
    this.statisticsService.productadmin({}).subscribe(
      (res: any) => {
        this.productadminStatistics = res.length;
        console.log('data product admin',this.productadminStatistics)
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error) => {
        console.error('Error fetching blog statistics', error);
        this.loading = false;
      }
    );
    this.statisticsService.productTop10({}).subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          this.top10Statistics = data.map((item: any) => ({
            name: item.name,
            image: item.images && item.images[0] ? item.images[0].linkImage : 'default-image-url' // Đảm bảo rằng hình ảnh tồn tại
            
          }));
        } else {
          console.log('No top 5 products found.');
        }
        console.log('data top 10',this.top10Statistics);
      },
      (error: any) => {
        console.error('Error fetching top 5 products:', error);
      }
    );
  }
  formatCurrency(value: number, addCurrency: boolean = false): string {
    if (addCurrency) {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  }

  updateDashboardItems(): void {
    if (this.accountUser && this.blogStatistics) {
      this.dashboardItems[0].value = this.accountUser.totalAccount;
      this.dashboardItems[1].value = this.accountUser.totalAccountBanned;
      this.dashboardItems[2].value = this.accountUser.totalOwner;
      this.dashboardItems[3].value = this.accountUser.totalOwnerBanned;
      this.dashboardItems[4].value = this.blogStatistics.totalAdversisement;
      this.dashboardItems[5].value = this.productadminStatistics;
      this.dashboardItems[6].value = this.orderStatistics.totalOrders;
      this.dashboardItems[7].value = this.orderStatistics.successfulOrders;
      this.dashboardItems[8].value = this.orderStatistics.failedOrders;
      this.dashboardItems[9].value = this.orderStatistics.canceledOrders;
      this.dashboardItems[10].formattedValue = this.formatCurrency(this.orderStatistics.totalRevenue,true);
      // this.dashboardItems[11].value = this.orderStatistics.totalMonthlyRevenue;

      this.loading = false; // Set loading to false after updating dashboard
    }
  }
}
