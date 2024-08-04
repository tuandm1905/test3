import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { cloudinaryConfig } from '../../../../../cloudinary.config';
import moment from 'moment';
import { OwnerService } from '../../services/owner.service';
import { StaffService } from '../../services/staff.service';


@Component({
	selector: 'app-profile-owner-page',
	templateUrl: './profile-owner-page.component.html',
	styleUrl: './profile-owner-page.component.scss'
})
export class ProfileOwnerPageComponent {

	@ViewChild('fileInput') fileInput!: ElementRef;
	selectedFile: File | null = null;
	image: string | null = null;  // Updated property name

	loading = false;


	form = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		// email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]), // Set email as disabled
		fullname: new FormControl(null, Validators.required),
		image: new FormControl(null as string | null, Validators.required),
		phone: new FormControl(null, Validators.required),
		address: new FormControl(null),
		ownerId: new FormControl(null),

		// dob: new FormControl(null as string | null), // Cập nhật ở đây
		// isBan: new FormControl(null),
	});


	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private ownerService: OwnerService,
		private http: HttpClient,
		private staffService: StaffService
	) {

	}

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.getProfile();
	}

	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Profile',
			link: '/owner/profile'
		}
	];

	tabLinks = [
		{ id: 'profile', name: 'Profile' },
		{ id: 'password', name: 'Change Password' },
	];
	detail: any

	getProfile() {
		let user: any = localStorage.getItem('user')
		if (!user) {
			window.location.href = '/owner/auth/login'
		}
		this.loading = true;
		this.ownerService.show(JSON.parse(user)?.id).subscribe(res => {
			this.loading = false;
			if (res?.message?.includes('successfully') && res?.data) {
				this.form.patchValue({
					email: res?.data?.email,
					fullname: res?.data?.fullname,
					image: res?.data?.image,
					phone: res?.data?.phone,
					address: res?.data?.address,
					ownerId: res?.data?.ownerId,
				});
				this.detail = res?.data
				this.formPassword.patchValue({
					ownerId: res?.data?.ownerId,
				})
				this.image = res?.data?.image
			}
		})
	}

	tabType = 'profile';

	changeTab(type: string) {
		this.tabType = type;
	}

	onFileSelected(event: any): void {
		const file = event.target.files[0];
		if (file) {
			this.selectedFile = file;
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.image = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			this.selectedFile = null;
			this.image = null;
		}
	}

	uploadImage(folderName: string): void {
		if (!this.selectedFile) return;
		const formData = new FormData();
		formData.append('file', this.selectedFile);
		formData.append('upload_preset', cloudinaryConfig.upload_preset);
		formData.append('folder', folderName);
		this.loading = true;
		this.http.post(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`, formData)
			.subscribe((response: any) => {
				this.loading = false;
				this.image = response.secure_url;
				this.form.patchValue({ image: this.image as string | null });
				this.selectedFile = null;
				this.ownerService.updateOwnerImage(this.form.value).subscribe(resApi => {
					console.log(resApi);
				})

			}, error => {
				this.loading = false;

				this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
			});
	}

	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form account is invalid");
			return;
		}
		this.loading = true;
		this.ownerService.updateOwnerProfile(this.form.value).subscribe(res => {
			this.loading = false;
			if (res?.message?.includes('successfully')) {
				this.ownerService.updateOwnerImage(this.form.value).subscribe(resApi => {
					console.log(resApi);
				})
				this.alertService.fireSmall('success', res?.message || "Update profile successfully")
			} else {
				this.alertService.fireSmall('error', res?.message || "Update profile failed")
			}
		})

	}

	formPassword: any = new FormGroup({
		ownerId: new FormControl(null),
		oldPassword: new FormControl(null),
		newPassword: new FormControl(null),
		confirmPassword: new FormControl(null),
	});
	messageError: any = null;

	changeValue(event: any) {
		this.messageError = null;
	}

	submitPassword() {
		if (this.formPassword.invalid) {
			this.alertService.fireSmall('error', 'Form password invalid!');
			return;
		}
		let data = this.formPassword.value;
		// if(data?.newPasswod?.trim() != data?.confirmPassword?.trim()) {
		// 	this.messageError = 'Password does not match.';
		// 	return;
		// }
		this.loading = true;
		console.log('new', this.formPassword.value.newPasswod)
		this.ownerService.changePassword(data).subscribe(res => {
			this.loading = false;
			if (res?.message?.includes('successfully')) {
				this.alertService.fireSmall('success', 'Change password successfully!');
				this.formPassword.reset();
				this.formPassword.patchValue({
					ownerId: this.detail?.ownerId
				})
			} else if (res?.errors) {
				this.alertService.showListError(res?.errors)
			} else {
				this.alertService.fireSmall('error', 'Change password failed!');
			}
		})
	}
}
