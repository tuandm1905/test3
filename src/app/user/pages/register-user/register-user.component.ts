import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  provinces: any[] = [];
  districts: any[] = [];
  communes: any[] = [];
  selectedProvince: any = null;
  selectedDistrict: any = null;
  selectedCommune: any = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  constructor(private fb: FormBuilder, private addressService: AddressService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      fullname: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      commune: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.addressService.getAddresses().subscribe(data => {
      this.provinces = data;
    });
  }

  onProvinceChange(event: any): void {
    const provinceId = event.target.value;
    this.selectedProvince = this.provinces.find(province => province.id === provinceId);
    this.districts = this.selectedProvince ? this.selectedProvince.districts : [];
    this.resetFields(['district', 'commune']);
    this.selectedDistrict = null;
    this.selectedCommune = null;
    this.communes = [];
  }

  onDistrictChange(event: any): void {
    const districtId = event.target.value;
    this.selectedDistrict = this.districts.find(district => district.id === districtId);
    this.communes = this.selectedDistrict ? this.selectedDistrict.wards : [];
    this.resetFields(['commune']);
    this.selectedCommune = null;
  }

  onCommuneChange(event: any): void {
    const communeId = event.target.value;
    this.selectedCommune = this.communes.find(commune => commune.id === communeId);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched || this.submitted) : false;
  }

  resetFields(fields: string[]): void {
    fields.forEach(field => {
      this.registerForm.get(field)?.reset();
    });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  getPasswordClass(): string {
    const passwordControl = this.registerForm.get('password');
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    const passwordMismatch = this.registerForm.hasError('passwordMismatch');

    if (!passwordControl?.touched && !confirmPasswordControl?.touched) {
      return '';
    } else if (passwordMismatch) {
      return 'error-password';
    } else if (passwordControl?.valid && confirmPasswordControl?.valid) {
      return 'valid-password';
    } else {
      return 'normal-password';
    }
  }

  getConfirmPasswordClass(): string {
    const passwordControl = this.registerForm.get('password');
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    const passwordMismatch = this.registerForm.hasError('passwordMismatch');

    if (!passwordControl?.touched && !confirmPasswordControl?.touched) {
      return '';
    } else if (passwordMismatch) {
      return 'error-password';
    } else if (passwordControl?.valid && confirmPasswordControl?.valid) {
      return 'valid-password';
    } else {
      return 'normal-password';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log('Form Values:', this.registerForm.value);
    }
  }
}
