import { NgModule } from '@angular/core';
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
import { DetailOrderComponent } from './components/order/detail-order/detail-order.component';
import { UpdateOrderComponent } from './components/order/update-order/update-order.component';
import { DeleteOrderComponent } from './components/order/delete-order/delete-order.component';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
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
import { NgxSummernoteModule } from 'ngx-summernote';
import { CateparentPageComponent } from './pages/cateparent-page/cateparent-page.component';
import { LoginAdminPageComponent } from './pages/login-page/login-admin-page.component';
import { CateParentFormComponent } from './components/cate-parent-form/cate-parent-form.component';
import { adminGuardGuard } from './admin-guard.guard';


const route: Routes = [
	{
		path: '',
		canActivate: [adminGuardGuard],
		component: AdminComponent,
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
				path: 'category',
				component: CategoryAdminPageComponent,
				title: 'Manage Category'
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
				path: 'brand',
				component: BrandAdminPageComponent,
				title: 'Manage Brand'
			},
			{
				path: 'advertisements',
				component: BlogAdminPageComponent,
				title: 'Manage Advertisements'
			},

			{
				path: 'category',
				component: CategoryAdminPageComponent,
				title: 'Manage Category'
			},
			{
				path: 'account',
				component: AccountAdminPageComponent,
				title: 'Manage Account'
			},
			{
				path: 'service',
				component: ServiceAdminPageComponent,
				title: 'Manage Service'
			},
			{
				path: 'owner',
				component: OwnerAdminPageComponent,
				title: 'Manage Owner'
			},
			{
				path: 'cateparent',
				component: CateparentPageComponent,
				title: 'Manage CateParent'
			},
		]
	},
	{
		path: 'auth/login',
		component: LoginAdminPageComponent,
		title: 'Login'
	},
]
@NgModule({
	declarations: [
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

		BrandAdminPageComponent,
		AddNewBrandComponent,
		DetailBrandComponent,
		UpdateBrandComponent,
		DeleteBrandComponent,

		OrderAdminPageComponent,
		AddNewOrderComponent,
		DetailOrderComponent,
		UpdateOrderComponent,
		DeleteOrderComponent,

		AdminComponent,

		AccountAdminPageComponent,
		AddNewAccountComponent,
		UpdateAccountComponent,
		DetailAccountComponent,
		OwnerAdminPageComponent,
		FormOwnerComponent,
		ServiceAdminComponent,
		ServiceAdminPageComponent,

		CateparentPageComponent,
		LoginAdminPageComponent,
		CateParentFormComponent,
		DashboardAdminPageComponent
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
	],
	exports: [
		CategoryAdminPageComponent,
		ProductAdminPageComponent,
		BrandAdminPageComponent,
		BlogAdminPageComponent
	]
})
export class AdminModule { }
