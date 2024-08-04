import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { StaffAuthService } from '../../services/staff-auth.service';
import { HttpClient } from '@angular/common/http';
import { cloudinaryConfig } from '../../../../../cloudinary.config';

@Component({
	selector: 'app-staff-profile',
	templateUrl: './staff-profile.component.html',
	styleUrl: './staff-profile.component.scss'
})
export class StaffProfileComponent {
	@ViewChild('fileInput') fileInput!: ElementRef;
	selectedFile: File | null = null;
	image: string | null = null;  // Updated property name

	loading = false;


	form = new FormGroup({
		email: new FormControl(null, Validators.required),
		fullname: new FormControl(null, Validators.required),
		image: new FormControl(null as string | null, Validators.required),
		phone: new FormControl(null, Validators.required),
		address: new FormControl(null),
		staffId: new FormControl(null),
		// dob: new FormControl(null as string | null), // Cập nhật ở đây
		// isBan: new FormControl(null),
	});

	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private ownerService: StaffAuthService,
		private http: HttpClient,
	) {

	}

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.getProfile();
	}

	breadCrumb: any = [
		{
			label: 'Staff',
			link: '/'
		},
		{
			label: 'Profile',
			link: '/staff/profile'
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
			window.location.href = '/staff/auth/login'
		}
		this.loading = true;
		this.ownerService.getUserInfo(JSON.parse(user)?.id).subscribe((res: any) => {
			this.loading = false;
			if (res?.message?.includes('successfully') && res?.data) {
				this.form.patchValue({
					email: res?.data?.email,
					fullname: res?.data?.fullname,
					image: res?.data?.image,
					phone: res?.data?.phone,
					address: res?.data?.address,
					staffId: res?.data?.staffId,
				});
				this.detail = res?.data
				this.formPassword.patchValue({
					staffId: res?.data.staffId,
				})
				console.log('id staff',this.form.value)
				console.log('id staff',this.form.value)
				console.log('id staff',this.formPassword.value)
				console.log('id staff',res.data.staffId)
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
				console.log('ảnh staff',this.form.value);
				this.ownerService.updateImage(this.form.value).subscribe(resApi => {
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
		this.ownerService.updateProfile(this.form.value).subscribe((res: any) => {
			this.loading = false;
			if (res?.message?.includes('successfully')) {

				this.alertService.fireSmall('success', res?.message || "Update profile successfully")
			} else {
				this.alertService.fireSmall('error', res?.message || "Update profile failed")
			}
		})

	}

	formPassword: any = new FormGroup({
		staffId: new FormControl(null, Validators.required),
		oldPassword: new FormControl(null, Validators.required),
		newPassword: new FormControl(null, Validators.required),
		confirmPassword: new FormControl(null, Validators.required),
	});
	messageError: any = null;

	changeValue(event: any) {
		this.messageError = null;
	}

	submitPassword() {
		console.log('check',this.formPassword.invalid)
		if (this.formPassword.invalid) {
			this.alertService.fireSmall('error', 'Form password invalid!');
			// return;
		}
		let data = this.formPassword.value;
		console.log('Form Data:', this.formPassword.value);
		console.log('old:', this.formPassword.value.oldPassword);
		console.log('old:', this.formPassword.value.newPasswod);
		// if (data?.newPasswod?.trim() != data?.confirmPassword?.trim()) {
		// 	this.messageError = 'Password does not match.';
		// 	return;
		// }
		this.loading = true;
		console.log('Form Data:', this.formPassword.value);
		console.log('iđ pass',this.detail.staffId)
		this.ownerService.changePassword(data).subscribe((res: any) => {
			this.loading = false;
			if (res?.message?.includes('successfully')) {
				this.alertService.fireSmall('success', 'Change password successfully!');
				this.formPassword.reset();
				this.formPassword.patchValue({
					staffId: this.detail?.staffId
				})
				
			} else if (res?.errors) {
				this.alertService.showListError(res?.errors)
			} else {
				this.alertService.fireSmall('error', 'Change password failed!');
			}
		})
	}
}
