import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../../shared/share.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { SideBarProductsComponent } from './components/side-bar-products/side-bar-products.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { ServicePageComponent } from './pages/service-page/service-page.component';
import { SliderComponent } from './components/slider/slider.component';
import { ProfileUserPageComponent } from './pages/profile-user-page/profile-user-page.component';
import { SidebarProfileComponent } from './components/sidebar-profile/sidebar-profile.component';
import { ChangePwUserPageComponent } from './pages/change-pw-user-page/change-pw-user-page.component';
import { FormsModule } from '@angular/forms';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { OrderHistoryDetailsComponent } from './pages/order-history-details/order-history-details.component';
import { OrderItemsComponent } from './components/order-items/order-items.component';
import { BlogDetailsPageComponent } from './pages/blog-details-page/blog-details-page.component';
import { CallForServicePageComponent } from './pages/call-for-service-page/call-for-service-page.component';
import { LoginUserPageComponent } from './pages/login-user-page/login-user-page.component';
import { VerifyEmailUserComponent } from './pages/verify-email-user/verify-email-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { VerifyCodeUserComponent } from './pages/verify-code-user/verify-code-user.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { AddressService } from './services/address.service';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
   declarations: [
      ProductDetailComponent,
      ProductItemComponent,
      ProductPageComponent,
      SideBarProductsComponent,
      BlogPageComponent,
      BlogDetailComponent,
      ServicePageComponent,
      SliderComponent,
      ProfileUserPageComponent,
      SidebarProfileComponent,
      ChangePwUserPageComponent,
      OrderHistoryComponent,
      OrderHistoryDetailsComponent,
      OrderItemsComponent,
      BlogDetailsPageComponent,
      CallForServicePageComponent,
      LoginUserPageComponent,
      VerifyEmailUserComponent,
      VerifyCodeUserComponent,
      RegisterUserComponent,
      CartPageComponent,
      // ChatComponent,
      MessageComponent,
   ],
   imports: [
      BrowserModule,
      ButtonModule,
      SharedModule,
      RouterModule,
      NgbModule, FormsModule, ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      FormsModule

   ],

   exports: [
      SliderComponent
   ],
   providers: [AddressService],
})
export class UserModule { }