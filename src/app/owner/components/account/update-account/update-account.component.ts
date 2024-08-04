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
      staffId: new FormControl(null), // Không cần thiết cho create
      email: new FormControl(null, Validators.required),
      password: new FormControl(null), // Đặt validator khi cần
      fullname: new FormControl(null, Validators.required),
      image: new FormControl(null as string | null, Validators.required),
      phone: new FormControl(null, Validators.required),
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
    // Kiểm tra nếu form không hợp lệ
    if (this.form.invalid) {
      console.log('Data staff chỉnh sửa', this.image);
      this.alertService.fireSmall('error', "Form Staff is invalid");
      return;
    }

    // Lấy dữ liệu từ form
    const formData = { ...this.form.value };

    // Nếu đang trong chế độ tạo mới (typeForm == 1), không gửi staffId
    if (this.typeForm === 1) {
      delete formData.staffId;
    }

    // Nếu không có thay đổi ở trường password, xóa trường này khỏi dữ liệu gửi đi
    if (this.typeForm !== 1 && !formData.password) {
      delete formData.password;
    }

    // Gửi dữ liệu đã xử lý
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
