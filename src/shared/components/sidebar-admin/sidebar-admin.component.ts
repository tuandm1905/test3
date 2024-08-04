// sidebar-admin.component.ts
import { Component, Input, OnChanges } from '@angular/core';

@Component({
	selector: 'app-sidebar-admin',
	templateUrl: './sidebar-admin.component.html',
	styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent implements OnChanges {
	@Input() isCollapsed = false;
	@Input() role: string = 'ADMIN';
	roleName = 'admin';

	siBarsAdminRoute = [
		{
			route: "/dashboard",
			role:['ALL'],
			name: "Dashboard"
		},
		{
			route: "/account",
			role:['ADMIN'],
			name: "Account"
		},
		{
			route: "/account",
			role:['OWNER'],
			name: "Account Staff"
		},
		{
			route: "/brand",
			role:['ADMIN'],
			name: "Brands"
		},
		{
			route: "/blog",
			role:['ADMIN', 'OWNER', 'STAFF'],
			name: "Blog"
		},
		{
			route: "/category",
			role:['ADMIN'],
			name: "Category"
		},
		{
			route: "/size",
			role:['OWNER'],
			name: "Size"
		},
		{
			route: "/description",
			role:['OWNER'],
			name: "Description"
		},
		{
			route: "/cateparent",
			role:['ADMIN'],
			name: "CateParent"
		},
		{
			route: "/product",
			role:['ADMIN', 'OWNER','STAFF'],
			name: "Product"
		},
		{
			route: "/service",
			role:['ADMIN'],
			name: "Services"
		},
		{
			route: "/order",
			role:['OWNER','STAFF'],
			name: "Orders"
		},
		{
			route: "/warehouse",
			role:['OWNER'],
			name: "WareHouses"
		},
		{
			route: "/voucher",
			role:['OWNER','STAFF'],
			name: "Vouchers"
		},
		{
			route: "/chat",
			role:['OWNER','STAFF'],
			name: "Chat"
		},
		{
			route: "/guestconsultation",
			role:['OWNER','STAFF'],
			name: "Guest Consultation"
		},
		{
			route: "/importproduct",
			role:['OWNER','STAFF'],
			name: "Import Product"
		},
		{
			route: "/notification",
			role:['OWNER','STAFF'],
			name: "Notification"
		}
	];

	constructor() {
		
	}

	ngOnChanges(): void {
		if(this.role) {
			this.roleName = this.role.toLocaleLowerCase();
		}
	}

	toggleMobileMenu() {
		// Logic to toggle mobile menu if needed
		if (window.innerWidth < 1024) {
			this.isCollapsed = !this.isCollapsed;
		}
	}

	checkRole(item: any) {
		return item?.role?.includes(this.role) || item?.role?.includes('ALL')
	}
}
