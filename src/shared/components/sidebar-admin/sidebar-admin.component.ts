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
			"route": "/dashboard",
			"role": ["ALL"],
			"name": "Dashboard"
		},
		{
			"route": "/account",
			"role": ["ADMIN"],
			"name": "Account"
		},
		{
			"route": "/account",
			"role": ["OWNER"],
			"name": "Staff Account"
		},
		{
			"route": "/product",
			"role": ["ADMIN", "OWNER", "STAFF"],
			"name": "Product"
		},
		{
			"route": "/order",
			"role": ["OWNER", "STAFF"],
			"name": "Orders"
		},
		{
			"route": "/category",
			"role": ["ADMIN"],
			"name": "Category"
		},
		{
			"route": "/cateparent",
			"role": ["ADMIN"],
			"name": "CateParent"
		},
		{
			"route": "/size",
			"role": ["OWNER", "STAFF"],
			"name": "Size"
		},
		{
			"route": "/description",
			"role": ["OWNER"],
			"name": "Description"
		},
		{
			"route": "/service",
			"role": ["ADMIN"],
			"name": "Services"
		},
		{
			"route": "/warehouse",
			"role": ["OWNER"],
			"name": "WareHouses"
		},
		{
			"route": "/importproduct",
			"role": ["OWNER", "STAFF"],
			"name": "Import Product"
		},
		{
			"route": "/voucher",
			"role": ["OWNER", "STAFF"],
			"name": "Vouchers"
		},
		{
			"route": "/guestconsultation",
			"role": ["OWNER", "STAFF"],
			"name": "Guest Consultation"
		},
		{
			"route": "/notification",
			"role": ["OWNER", "STAFF"],
			"name": "Notification"
		},
		{
			"route": "/chat",
			"role": ["OWNER", "STAFF"],
			"name": "Chat"
		}
	]
	
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
