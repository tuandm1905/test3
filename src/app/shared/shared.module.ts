import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './component/loading/loading.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { NgxLoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormErrorComponent } from './component/form-error/form-error.component';



@NgModule({
	declarations: [
		LoadingComponent,
		PaginationComponent,
		FormErrorComponent
	],
	imports: [
		CommonModule,
		NgxLoadingModule,
		NgbModule
	],
	exports: [
		LoadingComponent,
		PaginationComponent,
		FormErrorComponent
	]
})
export class SharedDataModule { }
