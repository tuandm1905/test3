import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './user/pages/home-page/home-page.component';
import { FileNotFoundComponent } from '../shared/components/error/file-not-found/file-not-found.component';
import { ForbiddenComponent } from '../shared/components/error/forbidden/forbidden.component';
import { ServerErrorComponent } from '../shared/components/error/server-error/server-error.component';
import { UnauthorizedComponent } from '../shared/components/error/unauthorized/unauthorized.component';
import { ProductDetailComponent } from './user/pages/product-detail/product-detail.component';
import { ProductPageComponent } from './user/pages/product-page/product-page.component';
import { ServicePageComponent } from './user/pages/service-page/service-page.component';
import { ProfileUserPageComponent } from './user/pages/profile-user-page/profile-user-page.component';
import { ChangePwUserPageComponent } from './user/pages/change-pw-user-page/change-pw-user-page.component';
import { OrderHistoryComponent } from './user/pages/order-history/order-history.component';
import { OrderHistoryDetailsComponent } from './user/pages/order-history-details/order-history-details.component';
import { BlogPageComponent } from './user/pages/blog-page/blog-page.component';
import { BlogDetailsPageComponent } from './user/pages/blog-details-page/blog-details-page.component';
import { CallForServicePageComponent } from './user/pages/call-for-service-page/call-for-service-page.component';
import { LoginUserPageComponent } from './user/pages/login-user-page/login-user-page.component';
import { VerifyEmailUserComponent } from './user/pages/verify-email-user/verify-email-user.component';
import { VerifyCodeUserComponent } from './user/pages/verify-code-user/verify-code-user.component';
import { RegisterUserComponent } from './user/pages/register-user/register-user.component';
import { CartPageComponent } from './user/pages/cart-page/cart-page.component';
import { ProfileOwnerPageComponent } from './owner/pages/profile-owner-page/profile-owner-page.component';
import { ImportproductDetailComponent } from './owner/pages/importproduct-detail/importproduct-detail.component';

const routes: Routes = [
  { path: '', redirectTo: "/homepage", pathMatch: "full" },
  { path: "homepage", component: HomePageComponent, title: "Trang chủ" },
  { path: "login-user", component: LoginUserPageComponent, title: "Trang chủ" },
  { path: "verify-email", component: VerifyEmailUserComponent, title: "Xác nhận Email" },
  { path: "verify-code", component: VerifyCodeUserComponent, title: "Xác nhận bằng mã" },
  { path: "register-user", component: RegisterUserComponent, title: "Đăng ký tài khoản người dùng" },

  { path: "profile", component: ProfileUserPageComponent, title: "Hồ sơ" },
  { path: "cart-page", component: CartPageComponent, title: "Giỏ Hàng" },
  { path: "order-history", component: OrderHistoryComponent, title: "Lịch sử mua hàng" },
  { path: "order-details", component: OrderHistoryDetailsComponent, title: "Chi tiết lịch sử đơn hàng" },
  { path: "change-password", component: ChangePwUserPageComponent, title: "Đổi mật khẩu" },
  { path: "blogs", component: BlogPageComponent, title: "Blogs" },
  { path: "blog-details", component: BlogDetailsPageComponent, title: "Chi tiet blog" },
  { path: "call-for-services", component: CallForServicePageComponent, title: "Nhận tư vấn" },
  { path: "products", component: ProductPageComponent, title: "Products" },
  { path: "product-detail/:id", component: ProductDetailComponent, title: "Product Detail" },
  { path: "services", component: ServicePageComponent, title: "Services" },
  // { path: "importproduct-deital", component: ImportproductDetailComponent, title: "Import Product Detail" },
  // { path: "profile-owner", component: ProfileOwnerPageComponent, title: "Hồ sơ" },

  {
	path: 'admin',
	loadChildren: () =>
		import('./admin/admin.module').then((m) => m.AdminModule),

  },
  {
	path: 'owner',
	loadChildren: () =>
		import('./owner/owner.module').then((m) => m.OwnerModule),

  },
  {
	path: 'staff',
	loadChildren: () =>
		import('./staff/staff.module').then((m) => m.StaffModule),

  },
  

  { path: "403", component: ForbiddenComponent, title: "403 - Bị từ chối truy cập" },
  { path: "401", component: UnauthorizedComponent, title: "401 - Không có quyền truy cập" },
  { path: "500", component: ServerErrorComponent, title: "500 - Lỗi máy chủ" },
  { path: "**", component: FileNotFoundComponent, title: "404 - Không tìm thấy trang" },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
