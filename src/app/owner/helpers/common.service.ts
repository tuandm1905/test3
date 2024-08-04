import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	constructor() { }

	showStatusErrorV2(formGroup: any, name: string, submitted = false) {
		return formGroup?.get(`${name}`)?.invalid && (formGroup?.get(`${name}`)?.dirty || formGroup?.get(`${name}`)?.touched || submitted);
	}

	buildItemParam(key: string, value: string | number | string[] | number[] | any, params: HttpParams): HttpParams {
		if(key == 'page' && !value) {
			params = params.append(`${key}`, '0');
		}
		if (value) {
			if(Array.isArray(value)) {
				value.forEach((item: string | number| any) => {
					params = params.append(`${key}[]`, item);
				});
				return params;
			}
			return params.append(`${key}`, value);
		}
		return params;
	}

	buildParams(values: any) {
		let params = new HttpParams;
		if (values) {
			let arrCondition = Object.entries(values);
			arrCondition.forEach((element: any) =>{
				if(element[1] != null) {
					params = this.buildItemParam(element[0], element[1], params);
				}
			});
		}
		return params;
	}

	onTrimFocusOutForm(group: FormGroup, controlName: string, event: any) {
		if(event) {
			this.setTrimValue(group, controlName, event.target.value.trim());
		}
	}

	setTrimValue(group: FormGroup, controlName: string, value: any) {
		if(value != '') {
			group.controls[`${controlName}`].setValue(value);
		} else {
			group.controls[`${controlName}`].setValue(null);
		}
	}

	

}
