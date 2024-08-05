import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent {
  @Input() account: any;
  @Input() typeForm: number; // 1 for create, 2 for edit
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() ownerId: any;

  form: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  image: string | null = null;

  constructor(
    public commonService: CommonService,
    private alertService: AlertService,
    private http: HttpClient,
  ) {
    this.form = new FormGroup({
      staffId: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      fullname: new FormControl('', Validators.required),
      image: new FormControl('', [Validators.required, Validators.min(0.01)]),
      phone: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(): void {
    if (!this.isVisible) {
      this.form.reset();
      this.form.enable();
    }

    if (this.typeForm == 1) {
      // Đặt validator cho trường password khi tạo mới
      this.form.get('password')?.setValidators(Validators.required);
      this.form.get('staffId')?.clearValidators(); // Không yêu cầu staffId khi tạo mới
    } else {
      // Xóa validator cho trường password khi chỉnh sửa
      this.form.get('password')?.clearValidators();
      this.form.get('staffId')?.setValidators(Validators.required); // Yêu cầu staffId khi chỉnh sửa
    }
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('staffId')?.updateValueAndValidity();

    if (this.account && this.typeForm != 1) {
      this.form.patchValue({
        staffId: this.account?.staffId,
        email: this.account?.email,
        fullname: this.account?.fullname,
        image: this.account?.image,
        phone: this.account?.phone,
      });
      if (this.typeForm == 2) {
        this.form.disable();
      }
    }
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

    this.http.post(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`, formData)
      .subscribe((response: any) => {
        this.image = response.secure_url;
        this.form.patchValue({ image: this.image as string | null });
        this.selectedFile = null;
      }, error => {
        this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
      });
  }

  submit() {
    // Log the form value for debugging
    console.log('Form data before processing:', this.form.value);

    // Check if the form is invalid
    if (this.form.invalid) {
      console.log('Form is invalid', this.form.errors);
      this.alertService.fireSmall('error', "Form is invalid");
      return;
    }

    // Get the form data
    const formData = { ...this.form.value };

    // If creating a new account (typeForm === 1), do not include staffId
    if (this.typeForm === 1) {
      delete formData.staffId;
    }

    // If not creating and the password field is empty, remove it from the formData
    if (this.typeForm !== 1 && !formData.password) {
      delete formData.password;
    }

    // Emit the processed data
    this.save.emit({
      form: formData,
      id: this.account?.accountId
    });
  }

  closeModal() {
    this.form.reset();
    this.close.emit();
  }
}
