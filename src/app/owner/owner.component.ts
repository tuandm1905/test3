import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-owner',
	templateUrl: './owner.component.html',
	styleUrl: './owner.component.scss'
})
export class OwnerComponent {
	url = null;
	constructor(private activeRoute: ActivatedRoute) {
		this.activeRoute.url.subscribe((res: any) => {
			console.log(res);
		})
	}
}
