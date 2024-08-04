import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AlertService } from '../../helpers/alert.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { INIT_PAGING } from '../../helpers/constant';
import { NotificationService } from '../../services/notification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from '../../../admin/services/account.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent implements OnInit {
  breadCrumb: any = [
    { label: 'Owner', link: '/' },
    { label: 'Order', link: '/owner/notification' }
  ];
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

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private authenService: AuthenService,
    private staffService: StaffService,
    private notificationService: NotificationService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.userType = user?.userType ?? '';
    this.ownerId = user?.id ? Number(user.id) : null;
    console.log('id owner', this.ownerId)
    if (this.userType == 'Staff') {
      this.staffService.show(user?.id ?? null).subscribe((res: any) => {
        this.ownerId = res?.data?.ownerId;
        this.getDataOrder(Number(this.ownerId));
        this.getDataList({ ...this.paging });
        // console.log('ID của Owner:', this.ownerId);
        // if (this.userType === 'Owner' || this.userType === 'Staff') {


        // }
      });
    } else {
      console.log('UserType là Owner:', this.userType);
      console.log('id owner khi ở Owner', this.ownerId)
      
      this.getDataOrder(Number(this.ownerId));
      this.getDataList({ ...this.paging });

    }
  }
  
  getDataOrder(ownerId: number) {
    this.loading = true;
    this.orderService.getData(ownerId).subscribe((res: any) => {
      this.loading = false;
      this.dataOrder = res;
      console.log('data Order ở hàm getDataOrder:', this.dataOrder);
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
        console.log('dataList trước khi gán giá trị:', this.dataList);
  
        // this.extractedIds = [];
        // const resultArray: any[] = []; // Tạo mảng để lưu các giá trị
  
        // this.dataList.forEach((item: any) => {
        //   const id = this.extractIdFromUrl(item.url);
        //   if (id !== null) {
        //     this.extractedIds.push(id);
        //     item.id = id; // Gán giá trị id vào trường codeOrder
  
        //     // Tìm kiếm thông tin từ dataOrder
        //     console.log('ID được lấy từ URL:', id);
        //     const orderDetails = this.findOrderDetails(id);
        //     if (orderDetails) {
        //       console.log('Đã lấy được codeOrder và FullName');
        //       item.codeOrder = orderDetails.codeOrder;
        //       item.fullName = orderDetails.fullName;
  
        //       // Lưu các giá trị vào mảng
        //       resultArray.push({
        //         id: item.id,
        //         codeOrder: item.codeOrder,
        //         fullName: item.fullName
        //       });
        //     }
        //   }
        // });
  
        // console.log('dataList sau khi gán giá trị:', this.dataList);
        // console.log('Extracted IDs:', this.extractedIds);
        // console.log('Result Array:', resultArray); // Hiển thị mảng chứa các giá trị
      }
  
      this.paging.total = res?.length || 0;
    });
  }
  

  // markAsRead(id: any) {
  //   this.notificationService.status(id).subscribe((res: any) => {
  //     if (res?.success) {
  //       // Cập nhật trạng thái "Unread" thành "Read" trong giao diện
  //       const item = this.dataList.find((i: any) => i.id === id);
  //       if (item) {
  //         item.isRead = true;
  //       }
  //     }
  //   });
  // }
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

      // Kiểm tra từ khóa tìm kiếm
      const searchTerm = this.formSearch.value?.name?.trim().toLowerCase();

      if (searchTerm) {
        // Lọc dữ liệu theo từ khóa tìm kiếm
        // console.log('search',this,this.dataListAll)
        const totalSearch = this.dataListAll?.filter((item: any) =>
          item?.name?.toLowerCase().includes(searchTerm)
        );
        this.paging.total = totalSearch?.length || 0;
        this.dataList = totalSearch?.slice(start, end); // Sử dụng slice để lấy dữ liệu theo trang
      } else {
        // Nếu không có từ khóa tìm kiếm, lấy tất cả dữ liệu
        this.dataList = this.dataListAll?.slice(start, end);
        this.paging.total = this.dataListAll?.length || 0;
      }
    }
  }
}
