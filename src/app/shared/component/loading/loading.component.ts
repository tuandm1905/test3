import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';
const SenaryOrange = '#ffa529';

@Component({
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnChanges{
	
	@Input() loading = false;
	@ViewChild('ngxLoading', { static: false })
	ngxLoadingComponent!: NgxLoadingComponent;
	@ViewChild('customLoadingTemplate', { static: false })
	customLoadingTemplate!: TemplateRef<any>;
	@ViewChild('emptyLoadingTemplate', { static: false })
	emptyLoadingTemplate!: TemplateRef<any>;

	public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
	public primaryColour = SenaryOrange;
	public secondaryColour = PrimaryWhite;
	public loadingTemplate!: TemplateRef<any>;
	public config = {
		animationType: this.ngxLoadingAnimationTypes.circle,
		primaryColour: this.primaryColour,
		secondaryColour: this.secondaryColour,
		tertiaryColour: this.primaryColour,
		fullscreenBackdrop: false,
	};

	ngOnChanges(changes: SimpleChanges): void {
	}

}
