import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerComponent } from './owner.component';
import { AddNewCategoryComponent } from './components/category/add-new-category/add-new-category.component';
import { DetailCategoryComponent } from './components/category/detail-category/detail-category.component';
import { UpdateCategoryComponent } from './components/category/update-category/update-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryAdminPageComponent } from './pages/category-page/category-admin-page.component';


import { AddNewProductComponent } from './components/product/add-new-product/add-new-product.component';
import { DetailProductComponent } from './components/product/detail-product/detail-product.component';
import { UpdateProductComponent } from './components/product/update-product/update-product.component';
import { DeleteProductComponent } from './components/product/delete-product/delete-product.component';
import { ProductAdminPageComponent } from './pages/product-page/product-admin-page.component';

import { BlogAdminPageComponent } from './pages/blog-page/blog-admin-page.component';
import { AddNewBlogComponent } from './components/blog/add-new-blog/add-new-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { DetailBlogComponent } from './components/blog/detail-blog/detail-blog.component';
import { UpdateBlogComponent } from './components/blog/update-blog/update-blog.component';

import { BrandAdminPageComponent } from './pages/brand-page/brand-admin-page.component';
import { AddNewBrandComponent } from './components/brand/add-new-brand/add-new-brand.component';
import { DetailBrandComponent } from './components/brand/detail-brand/detail-brand.component';
import { UpdateBrandComponent } from './components/brand/update-brand/update-brand.component';
import { DeleteBrandComponent } from './components/brand/delete-brand/delete-brand.component';

import { OrderAdminPageComponent } from './pages/order-page/order-admin-page.component';
import { AddNewOrderComponent } from './components/order/add-new-order/add-new-order.component';
// import { DetailOrderComponent } from './components/order/detail-order/detail-order.component';
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



import { DashboardAdminPageComponent } from './pages/dashboard-page/dashboard-admin-page.component';
import { ServiceAdminPageComponent } from './pages/service-page/service-admin-page.component';
import { OwnerAdminPageComponent } from './pages/owner-page/owner-admin-page.component';
import { FormOwnerComponent } from './components/owner/form-owner/form-owner.component';
import { ServiceAdminComponent } from './components/service-admin/service-admin.component';
import { VoucherPageComponent } from './pages/voucher-page/voucher-page.component';
import { WarehousePageComponent } from './pages/warehouse-page/warehouse-page.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { OwnerCategoryParentComponent } from './pages/category-parent/category-parent.component';
import { OwnerCateParentFormComponent } from './components/owner-cate-parent-form/owner-cate-parent-form.component';
import { OwnerLoginComponent } from './pages/owner-login/owner-login.component';
import { OwnerRegisterComponent } from './pages/owner-register/owner-register.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ownerGuardGuard } from './owner-guard.guard';
import { OwnerSizeComponent } from './pages/owner-size/owner-size.component';
import { OwnerDescriptionComponent } from './pages/owner-description/owner-description.component';
import { OwnerDescriptionFormComponent } from './components/owner-description-form/owner-description-form.component';
import { OwnerSizeFormComponent } from './components/owner-size-form/owner-size-form.component';
import { ProfileOwnerPageComponent } from './pages/profile-owner-page/profile-owner-page.component';
import { ChangepasswordOwnerComponent } from './pages/changepassword-owner/changepassword-owner.component';
import { DetailOrderComponent } from './components/order/detail-order/detail-order.component';
import { GuestconsultationPageComponent } from './pages/guestconsultation-page/guestconsultation-page.component';
import { AddNewConsultationComponent } from './components/guestconsultation/add-new-consultation/add-new-consultation.component';
import { UpdateConsultationComponent } from './components/guestconsultation/update-consultation/update-consultation.component';
import { ImportproductPageComponent } from './pages/importproduct-page/importproduct-page.component';
import { ImportproductDetailComponent } from './pages/importproduct-detail/importproduct-detail.component';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';

import { AddNewDescriptionComponent } from './components/owner-description-form/add-new-description/add-new-description.component';
import { DetailDescriptionComponent } from './components/owner-description-form/detail-description/detail-description.component';
import { UpdateDescriptionComponent } from './components/owner-description-form/update-description/update-description.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

const route: Routes = [
	{
		path: '',
		canActivate: [ownerGuardGuard],

		component: OwnerComponent,
		children: [
			{
				path: '',
				component: DashboardAdminPageComponent,
				title: 'Dashboard'
			},
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

			{
				path: 'blog',
				component: BlogAdminPageComponent,
				title: 'Manage Blog'
			},
			{
				path: 'account',
				component: AccountAdminPageComponent,
				title: 'Manage Account Staff'
			},
			{
				path: 'voucher',
				component: VoucherPageComponent,
				title: 'Manage Voucher'
			},
			{
				path: 'warehouse',
				component: WarehousePageComponent,
				title: 'Manage warehouse'
			},
			{
				path: 'profile',
				component: ProfileOwnerPageComponent,
				title: 'Manage Profile'
			},
			{
				path: 'change-password',
				component: ChangepasswordOwnerComponent,
				title: 'Manage Change Password'
			},
			{
				path: 'description',
				component: OwnerDescriptionComponent,
				title: 'Manage cateparent'
			},

			{
				path: 'size',
				component: OwnerSizeComponent,
				title: 'Manage cateparent'
			},
			{
				path: 'guestconsultation',
				component: GuestconsultationPageComponent,
				title: 'Manage Guest Consultation'
			},
			{
				path: 'importproduct',
				component: ImportproductPageComponent,
				title: 'Manage Import Product'
			},
			{
				path: 'importproduct-detail',
				component: ImportproductDetailComponent,
				title: 'Manage Import Product Detail'
			},
			{
				path: 'notification',
				component: NotificationPageComponent,
				title: 'Manage Notification'
			},
			{
				path: 'chat',
				component: ChatPageComponent,
				title: 'Manage Chat'
			}

		],

	},
	{
		path: 'auth/register',
		component: OwnerRegisterComponent,
		title: 'Register'
	},
	{
		path: 'auth/login',
		component: OwnerLoginComponent,
		title: 'Login'
	},
]
@NgModule({
	declarations: [
		OwnerComponent,
		CategoryAdminPageComponent,
		AddNewCategoryComponent,
		DetailCategoryComponent,
		UpdateCategoryComponent,

		ProductAdminPageComponent,
		AddNewProductComponent,
		DetailProductComponent,
		UpdateProductComponent,
		DeleteProductComponent,

		BlogAdminPageComponent,
		AddNewBlogComponent,
		DeleteBlogComponent,
		DetailBlogComponent,
		UpdateBlogComponent,

		// BrandAdminPageComponent,
		AddNewBrandComponent,
		DetailBrandComponent,
		UpdateBrandComponent,
		DeleteBrandComponent,

		OrderAdminPageComponent,
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
		VoucherPageComponent,
		WarehousePageComponent,
		WarehouseComponent,
		VoucherComponent,
		OwnerCategoryParentComponent,
		OwnerCateParentFormComponent,
		OwnerLoginComponent,
		OwnerRegisterComponent,
		OwnerSizeComponent,
		OwnerDescriptionComponent,
		OwnerDescriptionFormComponent,
		OwnerSizeFormComponent,
		ProfileOwnerPageComponent,
		ChangepasswordOwnerComponent,
		GuestconsultationPageComponent,
		AddNewConsultationComponent,
		UpdateConsultationComponent,
		DashboardAdminPageComponent,
		ImportproductPageComponent,
		BrandAdminPageComponent,
		BlogAdminPageComponent,
		ProductAdminPageComponent,
		OrderAdminPageComponent,
		VoucherPageComponent,
		ImportproductPageComponent,
		ImportproductDetailComponent,
		NotificationPageComponent,
		AddNewDescriptionComponent,
		DetailDescriptionComponent,
		UpdateDescriptionComponent,
  ChatPageComponent
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
		NgxSummernoteModule,
		MatInputModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
	]
})
export class OwnerModule {

}
