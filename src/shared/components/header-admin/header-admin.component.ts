import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OwnerService } from '../../../app/admin/services/owner.service';
import { AccountService } from '../../../app/admin/services/account.service';
import { StaffService } from '../../../app/owner/services/staff.service';
import { NotificationService } from '../../../app/owner/services/notification.service';
import { Subscription, interval } from 'rxjs'; // Import RxJS interval và Subscription
import { AlertService } from '../../../app/owner/helpers/alert.service';

@Component({
	selector: 'app-header-admin',
	templateUrl: './header-admin.component.html',
	styleUrls: ['./header-admin.component.scss'],
	moduleId: module.id,
})
export class HeaderAdminComponent implements OnInit, OnDestroy {
	@Output() sidebarToggle = new EventEmitter<void>();
	user: any;
	authenService: any;
	loading = false;
	profileImage: string = '';
	userId: number | null = null;
	userType: string | null = null;
	fullname: string = '';
	previousNotificationCount: number = 0; // Lưu số lượng thông báo cũ

	private notificationSubscription: Subscription | null = null; // Subscription để hủy sau này

	constructor(
		private activeRoute: ActivatedRoute,
		private router: Router,
		private ownerService: OwnerService,
		private adminService: AccountService,
		private staffService: StaffService,
		private notificationService: NotificationService,
		private alertService: AlertService, // Sử dụng AlertService
	) {
		this.activeRoute.queryParams.subscribe((res: any) => {
			let userLocal = localStorage.getItem('user');
			this.user = userLocal ? JSON.parse(userLocal) : null;
			if (this.user) {
				this.userId = Number(this.user.id);
				this.userType = this.user.userType;
			}
		});
	}

	ngOnInit(): void {
		this.loadUserProfile();

		// Thiết lập interval để gọi API notification mỗi 5 giây
		this.notificationSubscription = interval(5000).subscribe(() => {
			this.checkForNotifications();
		});
	}

	ngOnDestroy(): void {
		// Hủy subscription khi component bị phá hủy
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	checkForNotifications(): void {
		if (this.userId !== null) {
			//console.log('Checking for notifications...');
			this.notificationService.noti(this.userId).subscribe(
				(res: any) => {
					//console.log('Notifications:', res);
					//console.log(res.length,',',this.previousNotificationCount)
					// Kiểm tra nếu có thông báo mới và đã từng có lần kiểm tra trước đó
					if (this.previousNotificationCount > 0 && res.length > this.previousNotificationCount) {
						const newNotifications = res.slice(this.previousNotificationCount); // Lấy những thông báo mới
						newNotifications.forEach((notification: any) => {
							// Hiển thị nội dung của từng thông báo mới
							//console.log('Thông báo mới:', notification.content);
							this.alertService.fireSmall('success', notification.content); // Hiển thị thông báo
						});
					}
	
					// Cập nhật số lượng thông báo cũ
					this.previousNotificationCount = res.length;
				},
				(error) => {
					//console.error('Error fetching notifications', error);
				}
			);
		}
	}
	
	

	toggleSidebar() {
		this.sidebarToggle.emit();
	}

	loadUserProfile(): void {
		if (this.userType === 'Admin' && this.userId !== null) {
			this.loadAdminProfile();
		} else if (this.userType === 'Owner' && this.userId !== null) {
			this.loadOwnerProfile();
		} else if (this.userType === 'Staff' && this.userId !== null) {
			this.loadStaffProfile();
		}
	}

	loadOwnerProfile() {
		this.loading = true;
		this.ownerService.show(this.userId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.data?.image || '';
				this.fullname = res?.data?.fullname;
				console.log('Owner ID:', res?.data?.ownerId);
				console.log('Owner Email:', res?.data?.email);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching owner profile', error);
			}
		);
	}

	loadAdminProfile() {
		this.loading = true;
		this.adminService.show(this.userId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.image || '';
				this.fullname = res?.fullname;
				console.log('Admin ID:', res?.accountId);
				console.log('Admin Email:', res?.email);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching admin profile', error);
			}
		);
	}

	loadStaffProfile() {
		this.loading = true;
		this.staffService.show(this.userId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.data?.image || '';
				this.fullname = res?.data?.fullname;
				console.log('Staff ID:', res?.data?.staffId);
				console.log('Staff Email:', res?.data?.email);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching staff profile', error);
			}
		);
	}

	openProfile() {
		if (this.userType === 'Admin') {
			this.router.navigate(['/admin/profile']);
		} else if (this.userType === 'Owner') {
			this.router.navigate(['/owner/profile']);
		} else if (this.userType === 'Staff') {
			this.router.navigate(['/staff/profile']);
		}
	}

	changePassword() {
		if (this.userType === 'admin') {
			this.router.navigate(['/admin/change-password']);
		} else if (this.userType === 'owner') {
			this.router.navigate(['/owner/change-password']);
		} else if (this.userType === 'staff') {
			this.router.navigate(['/staff/change-password']);
		}
	}

	logout() {
		localStorage.clear();
		if (this.userType === 'Admin') {
			this.router.navigate(['/admin/auth/login']);
		} else if (this.userType === 'Owner' || this.userType === 'Staff') {
			this.router.navigate(['/owner/auth/login']);
		} else {
			// Điều hướng đến trang đăng nhập mặc định nếu không xác định được userType
			this.router.navigate(['/auth/login']);
		}
	}
}
