import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import { AddNewCategoryComponent } from './components/category/add-new-category/add-new-category.component';
import { DetailCategoryComponent } from './components/category/detail-category/detail-category.component';
import { UpdateCategoryComponent } from './components/category/update-category/update-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryAdminPageComponent } from './pages/category-page/category-admin-page.component';


import { AddNewProductComponent } from './components/product/add-new-product/add-new-product.component';
import { DetailProductComponent } from './components/product/detail-product/detail-product.component';
import { UpdateProductComponent } from './components/product/update-product/update-product.component';
import { DeleteProductComponent } from './components/product/delete-product/delete-product.component';
import { ProductAdminPageComponent } from '../owner/pages/product-page/product-admin-page.component';

import { BlogAdminPageComponent } from '../owner/pages/blog-page/blog-admin-page.component';
import { AddNewBlogComponent } from './components/blog/add-new-blog/add-new-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { DetailBlogComponent } from './components/blog/detail-blog/detail-blog.component';
import { UpdateBlogComponent } from './components/blog/update-blog/update-blog.component';

import { BrandAdminPageComponent } from '../owner/pages/brand-page/brand-admin-page.component';
import { AddNewBrandComponent } from './components/brand/add-new-brand/add-new-brand.component';
import { DetailBrandComponent } from './components/brand/detail-brand/detail-brand.component';
import { UpdateBrandComponent } from './components/brand/update-brand/update-brand.component';
import { DeleteBrandComponent } from './components/brand/delete-brand/delete-brand.component';

import { OrderAdminPageComponent } from '../owner/pages/order-page/order-admin-page.component';
import { AddNewOrderComponent } from './components/order/add-new-order/add-new-order.component';
import { DetailOrderComponent } from './components/order/detail-order/detail-order.component';
import { UpdateOrderComponent } from './components/order/update-order/update-order.component';
import { DeleteOrderComponent } from './components/order/delete-order/delete-order.component';

import { Route, RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/share.module';
import { SharedDataModule } from '../shared/shared.module';

import { AccountAdminPageComponent } from './pages/account-page/account-admin-page.component';
import { AddNewAccountComponent } from './components/account/add-new-account/add-new-account.component';
import { UpdateAccountComponent } from './components/account/update-account/update-account.component';
import { DetailAccountComponent } from './components/account/detail-account/detail-account.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

import { DashboardAdminPageComponent } from '../owner/pages/dashboard-page/dashboard-admin-page.component';
import { ServiceAdminPageComponent } from './pages/service-page/service-admin-page.component';
import { OwnerAdminPageComponent } from './pages/owner-page/owner-admin-page.component';
import { FormOwnerComponent } from './components/owner/form-owner/form-owner.component';
import { ServiceAdminComponent } from './components/service-admin/service-admin.component';
import { VoucherPageComponent } from '../owner/pages/voucher-page/voucher-page.component';
import { VoucherComponent } from './components/voucher/voucher.component';

import { NgxSummernoteModule } from 'ngx-summernote';

import { CateParentStaffComponent } from './pages/cate-parent-staff/cate-parent-staff.component';
import { StaffCateParentFormComponent } from './components/staff-cate-parent-form/staff-cate-parent-form.component';
import { StaffLoginComponent } from './pages/staff-login/staff-login.component';
import { StaffRegisterComponent } from './pages/staff-register/staff-register.component';
import { StaffSizeFormComponent } from './components/staff-size-form/staff-size-form.component';
import { StaffDescriptionFormComponent } from './components/staff-description-form/staff-description-form.component';
import { StaffDescriptionComponent } from './pages/staff-description/staff-description.component';
import { StaffSizeComponent } from './pages/staff-size/staff-size.component';
import { StaffProfileComponent } from './pages/staff-profile/staff-profile.component';
import { staffGuardGuard } from './staff-guard.guard';
import { GuestconsultationPageComponent } from '../owner/pages/guestconsultation-page/guestconsultation-page.component';
import { ImportproductPageComponent } from '../owner/pages/importproduct-page/importproduct-page.component';
import { NotificationPageComponent } from '../owner/pages/notification-page/notification-page.component';

const route: Routes = [
	{
		path: '',
		canActivate: [staffGuardGuard],
		component: StaffComponent,

		children: [
			{
				path: 'dashboard',
				component: DashboardAdminPageComponent,
				title: 'Dashboard'
			},

			{
				path: 'product',
				component: ProductAdminPageComponent,
				title: 'Manage Product'
			},
			{
				path: 'order',
				component: OrderAdminPageComponent,
				title: 'Manage Order'
			},
			// {
			// 	path: 'brand',
			// 	component: BrandAdminPageComponent,
			// 	title: 'Manage Brand'
			// },
			{
				path: 'blog',
				component: BlogAdminPageComponent,
				title: 'Manage Blog'
			},
			{
				path: 'voucher',
				component: VoucherPageComponent,
				title: 'Manage Voucher'
			},
			{
				path: 'cateparent',
				component: CateParentStaffComponent,
				title: 'Manage CateParent'
			},
			{
				path: 'profile',
				component: StaffProfileComponent,
				title: 'Manage Profile'
			},
			{
				path: 'guestconsultation',
				component: GuestconsultationPageComponent,
				title: 'Manage Gest Consultation'
			},
			{
				path: 'importproduct',
				component: ImportproductPageComponent,
				title: 'Manage Import Product'
			},
			{
				path: 'notification',
				component: NotificationPageComponent,
				title: 'Manage Notification'
			}


		]
	},
	{
		path: 'auth/register',
		component: StaffRegisterComponent,
		title: 'Register'
	},
	{
		path: 'auth/login',
		component: StaffLoginComponent,
		title: 'Login'
	},
]

@NgModule({
	declarations: [
		StaffComponent,
		CategoryAdminPageComponent,
		AddNewCategoryComponent,
		DetailCategoryComponent,
		UpdateCategoryComponent,

		// ProductAdminPageComponent,
		AddNewProductComponent,
		DetailProductComponent,
		UpdateProductComponent,
		DeleteProductComponent,

		// BlogAdminPageComponent,
		AddNewBlogComponent,
		DeleteBlogComponent,
		DetailBlogComponent,
		UpdateBlogComponent,

		// BrandAdminPageComponent,
		AddNewBrandComponent,
		DetailBrandComponent,
		UpdateBrandComponent,
		DeleteBrandComponent,

		// OrderAdminPageComponent,
		AddNewOrderComponent,
		DetailOrderComponent,
		UpdateOrderComponent,
		DeleteOrderComponent,


		AccountAdminPageComponent,
		AddNewAccountComponent,
		UpdateAccountComponent,
		DetailAccountComponent,
		OwnerAdminPageComponent,
		FormOwnerComponent,
		ServiceAdminComponent,
		ServiceAdminPageComponent,
		// VoucherPageComponent,
		VoucherComponent,
		CateParentStaffComponent,
		StaffCateParentFormComponent,
		StaffLoginComponent,
		StaffRegisterComponent,
		StaffSizeFormComponent,
		StaffDescriptionFormComponent,
		StaffDescriptionComponent,
		StaffSizeComponent,
		StaffProfileComponent,
	],
	imports: [
		FormsModule,
		CommonModule,
		NgSelectModule,
		SharedModule,
		MatMenuModule,
		MatChipsModule,
		ReactiveFormsModule,
		SharedDataModule,
		RouterModule.forChild(route),
		NgxSummernoteModule
	]
})
export class StaffModule { }
