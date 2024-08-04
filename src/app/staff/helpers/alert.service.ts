import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	constructor(
		private router: Router
	) {
	}

	fireSmall(type: any, title: any) {
		Swal.fire({
			icon: type,
			title: title,
			showConfirmButton: false,
			toast: true,
			position: 'top-end',
			timer: 3000
		});
	}

	fireConfirm(title: any, content: any, type?: any, cancelButtonText?: any, confirmButtonText?: string) {
		return Swal.fire({
			title: title,
			html: content,
			icon: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: confirmButtonText || 'Yes',
			cancelButtonText: cancelButtonText || 'No',
			reverseButtons: true
		});
	}

	fireConfirmYes(title: any, content: any, buttonText?: string) {
		Swal.fire({
			icon: 'info',
			title: title || null,
			html: content,
			showCancelButton: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: buttonText || 'OK'
		});
	}

	fireConfirmYesNoCustomize(title: any, content: any, type?: any) {
		return Swal.fire({
			title: title,
			html: content,
			icon: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!',
			reverseButtons: true
		});
	}

	showListError(errors: any) {
		let html = '';
		let values = Object.values(errors);
		values.forEach((value) => {
			html += '<li>' + JSON.stringify(value) + '</li>';
		});
		this.fireConfirmYes('Thông tin không hợp lệ', `<ul class="err-msg-list">${html}</ul>`, 'Bổ sung')
	}

}
