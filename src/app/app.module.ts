import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './user/pages/home-page/home-page.component';
import { SharedModule } from '../shared/share.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CloudinaryModule } from '@cloudinary/ng';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { OwnerModule } from './owner/owner.module';
import { StaffModule } from './staff/staff.module';
// import { tokenInterceptor } from './interceptor/token.interceptor';

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		SharedModule,
		UserModule,
		NgbModule,
		FormsModule,
		CloudinaryModule,
		HttpClientModule,
		AdminModule,
		StaffModule,
		OwnerModule,
	],
	providers: [
		provideAnimationsAsync()
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
