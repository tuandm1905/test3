import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './constant';
import { catchError, delay, of } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
	providedIn: 'root'
})
export class BaseApiService {


	headers = new HttpHeaders({
		'Content-Type': 'application/json, *',
		"Authentication": "Bearer " + this.getItem('token')
	});

	headersForm = new HttpHeaders({
		'Accept': 'application/json, multipart/form-data, *',
		"Authentication": "Bearer " + this.getItem('token')

	});
	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) { }

	getItem(key: any) {
		let data = localStorage.getItem('token');
		return data 
	}


	getMethod(url: string, params: any, headers?: any) {
		let filters = this.commonService.buildParams(params);
		return this.http.get(`${URL_API}` + url, { params: filters, headers: headers || this.headers})
			.pipe(delay(500), catchError((e: any) => {
				console.log(e);
				return of(e)
			}
			));
	}

	postMethod(url: string, data: any, typeHeader?: any) {


		return this.http.post(`${URL_API}` + url, data, {
			headers: typeHeader ? this.headers : this.headersForm
		})
			.pipe(
				delay(500),
				catchError((e: any) => {
					return of(e?.error)
				}
				));
	}

	putMethod(url: string, data: any, typeHeader?: any) {

		return this.http.put(`${URL_API}` + url, data, {
			headers: typeHeader ? this.headers : this.headersForm
		})
			.pipe(delay(500), catchError((e: any) => {
				console.log(e);
				return of(e?.error)
			}
			));
	}
	patchMethod(url: string, data: any, typeHeader?: any) {
		return this.http.patch(`${URL_API}` + url, data, {
			headers: typeHeader ? this.headers : this.headersForm
		})
			.pipe(delay(500), catchError((e: any) => {
				console.log(e);
				return of(e?.error)
			}
			));
	}

	deleteMethod(url: string) {
		return this.http.delete(`${URL_API}` + url, {headers: this.headers })
			.pipe(delay(500), catchError((e: any) => {

				return of(e?.error)
			}
			));
	}

	setFormData(data: any) {
		let formData = new FormData();
		if (data) {
			Object.entries(data)?.forEach((item: any) => {
				formData.append(item[0], item[1]);
			})
		}
		return formData;
	}
}
