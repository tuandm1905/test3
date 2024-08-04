import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {
  @Input() category: any = null;
  @Input() categoryParents: any = [];
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form = new FormGroup({
    Name: new FormControl(null, Validators.required),
    Image: new FormControl(null as string | null, Validators.required),
    CateParentId: new FormControl(null, Validators.required),
  });

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  image: string | null = null;  // Updated property name

  constructor(
    public commonService: CommonService,
    private alertService: AlertService,
    private http: HttpClient,
    private categoryService: CategoryService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && this.category) {
      this.form.patchValue({
        Name: this.category.name,
        Image: this.category.image as string | null,
        CateParentId: this.category.cateParentId
      });
      this.image = this.category.image; // Cập nhật hình ảnh khi có thay đổi
    }
    if (!this.isVisible) {
      this.form.reset();
      this.image = null; // Đặt lại hình ảnh khi modal bị ẩn
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
        this.form.patchValue({ Image: this.image as string | null });
        this.selectedFile = null;
      }, error => {
        this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
      });
  }

  saveCategory() {
    if (this.form.invalid) {
      this.alertService.fireSmall('error', "Form Category is invalid");
      return;
    }

    // if (!this.image) {
    //   this.alertService.fireSmall('error', "Please select and upload an image before saving.");
    //   return;
    // }

    this.save.emit({
      form: this.form.value,
      id: this.category?.categoryId
    });
  }

  closeModal() {
    this.form.reset();
    this.image = null; // Đặt lại hình ảnh khi đóng modal
    this.close.emit();
  }
}
