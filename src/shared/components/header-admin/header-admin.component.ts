import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OwnerService } from '../../../app/admin/services/owner.service';
import { AccountService } from '../../../app/admin/services/account.service';
import { StaffService } from '../../../app/owner/services/staff.service';

@Component({
	selector: 'app-header-admin',
	templateUrl: './header-admin.component.html',
	styleUrls: ['./header-admin.component.scss'],
	moduleId: module.id,
})
export class HeaderAdminComponent {
	@Output() sidebarToggle = new EventEmitter<void>();
	user: any;
	authenService: any;
	loading = false;
	profileImage: string = '';
	userId: number | null = null;
	userType: string | null = null;
	fullname: string ='';

	constructor(
		private activeRoute: ActivatedRoute,
		private router: Router,
		private ownerService: OwnerService,
		private adminService: AccountService,
		private staffService: StaffService,
	) {
		this.activeRoute.queryParams.subscribe((res: any) => {
			let userLocal = localStorage.getItem('user');
			this.user = userLocal ? JSON.parse(userLocal) : null;
			if (this.user) {
				this.userId = Number(this.user.id);
				this.userType = this.user.userType;
				//console.log('id',this.userId);
				//console.log('userType',this.user.userType);
				
			  }
		});
	}

	toggleSidebar() {
		this.sidebarToggle.emit();
	}

	ngOnInit(): void {
		this.loadUserProfile();
	}

	loadUserProfile(): void {
		//console.log('user id:', this.userId)
		if (this.userType  === 'Admin' && this.userId !== null) {
			//console.log('admin id:', this.userId)
			this.loadAdminProfile();
		} else if (this.userType  === 'Owner' && this.userId !== null) {
			//console.log('owner id:', this.userId)
			this.loadOwnerProfile();
		} else if(this.userType === 'Staff' && this.userId !== null) {
			//console.log('staff id:', this.userId)
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
				//console.log('Owner profile image:', res?.data?.image);
				console.log('Owner ID:', res?.data?.ownerId);
				//console.log('Owner Name:', res?.data?.fullname);
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
		this.adminService.show( this.userId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.image || '';
				this.fullname = res?.fullname;
				//console.log('Admin profile image:', res?.image);
				console.log('Admin ID:', res?.accountId);
				//console.log('Admin Name:', res?.fullname);
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
		this.staffService.show( this.userId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.data?.image || '';
				this.fullname = res?.data?.fullname;
				//console.log(res)
				//console.log('Staff profile image:', res?.data?.image);
				console.log('Staff ID:', res?.data?.staffId);
				//console.log('Staff Name:', res?.data?.fullname);
				console.log('Staff Email:', res?.data?.email);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching staff profile', error);
			}
		);
	}

	openProfile() {
		// const userType = this.user?.userType;
		if (this.userType  === 'Admin') {
			this.router.navigate(['/admin/profile']);
		} else if (this.userType  === 'Owner') {
			this.router.navigate(['/owner/profile']);
		} else if (this.userType  === 'Staff') {
			this.router.navigate(['/staff/profile']);
		}
	}

	changePassword() {
		// const userType = this.user?.userType;
		if (this.userType  === 'admin') {
			this.router.navigate(['/admin/change-password']);
		} else if (this.userType  === 'owner') {
			this.router.navigate(['/owner/change-password']);
		} else if (this.userType  === 'staff') {
			this.router.navigate(['/staff/change-password']);
		}
	}

	logout() {
		localStorage.clear();
		if (this.userType === 'Admin') {
			this.router.navigate(['/admin/auth/login']);
		} else if (this.userType === 'Owner' || this.userType ==='Staff') {
			this.router.navigate(['/owner/auth/login']);
		} else {
			// Điều hướng đến trang đăng nhập mặc định nếu không xác định được userType
			this.router.navigate(['/auth/login']);
		}
	}
	
}
