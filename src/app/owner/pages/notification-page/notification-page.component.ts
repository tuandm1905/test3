import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AlertService } from '../../helpers/alert.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { INIT_PAGING } from '../../helpers/constant';
import { NotificationService } from '../../services/notification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from '../../../admin/services/account.service';
import { Subscription, interval } from 'rxjs'; // Import thêm từ RxJS

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit, OnDestroy {
  // breadCrumb: any = [
  //   { label: 'Owner', link: '/' },
  //   { label: 'Order', link: '/owner/notification' }
  // ];

  dataList: any = [];
  dataListAll: any = [];
  selectedBrand: any = null;
  modalTitle: string = '';
  createModal: boolean = false;
  showModal: boolean = false;
  openModal: boolean = false;
  updateModal: boolean = false;
  dataOrder: any = [];
  pageName: string = 'order';
  paging: any = { ...INIT_PAGING };
  ownerId: number | null = null;
  userType: string = '';
  loading = false;
  formSearch: any = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null)
  });

  breadCrumb: any = [];
  private notificationSubscription: Subscription | null = null; // Subscription để hủy sau này
  private counter: number = 0; // Biến đếm thời gian

  constructor(
    private orderService: OrderService,
    private alertService: AlertService, // Sử dụng AlertService
    private authenService: AuthenService,
    private staffService: StaffService,
    private notificationService: NotificationService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    this.ownerId = user?.id ? Number(user.id) : null;
    this.breadCrumb = [
      {
        label: this.userType === 'Staff' ? 'Staff' : 'Owner',
        link: '/',
      },
      {
        label: 'Order', link: '/owner/notification'
      },
    ];
    console.log('id owner', this.ownerId);
    if (this.userType == 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        this.getDataOrder(Number(this.ownerId));
        this.getDataList({ ...this.paging });
      });
    } else {
      console.log('UserType là Owner:', this.userType);
      console.log('id owner khi ở Owner', this.ownerId);

      this.getDataOrder(Number(this.ownerId));
      this.getDataList({ ...this.paging });
    }

    // Thiết lập interval để gọi API mỗi 5 giây
    // this.notificationSubscription = interval(5000).subscribe(() => {
    //   this.counter += 5; // Tăng bộ đếm mỗi 5 giây
    //   console.log(`Đã đếm được ${this.counter} giây`);
    //   this.checkForNewNotifications();
    // });
  }

  ngOnDestroy(): void {
    // Hủy subscription khi component bị phá hủy
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  checkForNewNotifications(): void {
    if (this.ownerId !== null) {
      console.log('Gọi API để kiểm tra thông báo mới...');
      this.notificationService.noti(this.ownerId).subscribe((res: any) => {
        console.log('Kết quả API:', res);
        if (res && res.length > this.dataListAll.length) {
          // Cập nhật danh sách nếu có thông báo mới
          this.dataListAll = res;
          console.log('Có thông báo mới:', this.dataListAll);
          this.alertService.fireSmall('success', this.dataListAll.content); // Hiển thị thông báo
        }
      });
    }
  }

  // Các hàm còn lại không thay đổi

  getDataOrder(ownerId: number) {
    this.loading = true;
    this.orderService.getData(ownerId).subscribe((res: any) => {
      this.loading = false;
      this.dataOrder = res;
      // console.log('data Order ở hàm getDataOrder:', this.dataOrder);
    });
  }

  extractedIds: number[] = [];

  extractIdFromUrl(url: string): number | null {
    const urlParts = url.split('/');
    const idStr = urlParts[urlParts.length - 1];
    const id = parseInt(idStr, 10);
    return isNaN(id) ? null : id;
  }

  getDataList(params: any) {
    this.loading = true;
    this.notificationService.noti(this.ownerId).subscribe((res: any) => {
      this.loading = false;
      this.dataListAll = res;
      console.log('dataListAll:', this.dataListAll);
      if (this.dataListAll?.length > 0) {
        let start = (this.paging?.page - 1) * this.paging.pageSize;
        let end = this.paging?.page * this.paging.pageSize;
        this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);
        // console.log('dataList trước khi gán giá trị:', this.dataList);
      }
      this.paging.total = res?.length || 0;
    });
  }

  findOrderDetails(id: number) {
    console.log('data Order', this.dataOrder);
    const details = this.dataOrder.find((order: any) => order.orderId === id) || null;
    if (details) {
      console.log(`Chi tiết order với orderId=${id}:`, details);
      console.log(`Chi tiết codeOrder: ${details.codeOrder}`);
      console.log(`Chi tiết fullName: ${details.fullName}`);
    } else {
      console.log(`Không tìm thấy order với orderId=${id}`);
    }
    return details;
  }

  selected: any;
  viewItem(id: number) {
    console.log('id codeOrder:', id);
    const data = this.dataOrder.find((c: any) => c.orderId === id);
    this.selected = { ...data };
    this.modalTitle = 'View Notification';
    this.openModal = true;
  }

  resetSearchForm() {
    this.formSearch.reset();
  }

  search() {
    if (this.userType === 'Owner') {
      this.pageChanged(1);
    }
  }

  closeModal() {
    this.createModal = false;
    this.showModal = false;
    this.updateModal = false;
    this.openModal = false;
  }

  pageChanged(e: any) {
    this.paging.page = e;

    if (this.dataListAll?.length > 0) {
      const start = (this.paging.page - 1) * this.paging.pageSize;
      const end = this.paging.page * this.paging.pageSize;

      const searchTerm = this.formSearch.value?.name?.trim().toLowerCase();

      if (searchTerm) {
        const totalSearch = this.dataListAll?.filter((item: any) =>
          item?.name?.toLowerCase().includes(searchTerm)
        );
        this.paging.total = totalSearch?.length || 0;
        this.dataList = totalSearch?.slice(start, end);
      } else {
        this.dataList = this.dataListAll?.slice(start, end);
        this.paging.total = this.dataListAll?.length || 0;
      }
    }
  }
}
