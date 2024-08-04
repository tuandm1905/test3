import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { GuestconsultationService } from '../../../services/guestconsultation.service';

@Component({
	selector: 'app-update-consultation',
	templateUrl: './update-consultation.component.html',
	styleUrl: './update-consultation.component.scss'
})
export class UpdateConsultationComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	showReviews: boolean = false;
	formattedDescription: string = '';
	comments: any[] = [];
	selectedSize: any;

	@ViewChild(NgxSummernoteDirective) summernote: any;
	form = new FormGroup({
		fullname: new FormControl(null, Validators.required),
		phone: new FormControl(null),
		content: new FormControl(null, Validators.required),
		statusGuestId: new FormControl(null, Validators.required),
		statusGuestName: new FormControl(null, Validators.required),
		adId: new FormControl(null, Validators.required),
		advertisementTitle: new FormControl(null, Validators.required),

	});
	public config: any = {
		placeholder: 'Nội dung',
		tabsize: 2,
		height: '200px',
		// uploadImagePath: '/api/upload',
		toolbar: [
			['misc', ['codeview', 'undo', 'redo']],
			['style', ['bold', 'italic', 'underline', 'clear']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontsize', ['fontname', 'fontsize', 'color']],
			['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
			['insert', ['table', 'picture', 'link', 'video', 'hr']]
		],
		fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
	}

	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private consulationService: GuestconsultationService
	) {

	}
	ngOnChanges(): void {
		this.form.reset();
		console.log('form', this.form.invalid);
		console.log(this.isVisible);
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}

		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				fullname: this.data?.fullname,
				phone: this.data?.phone,
				content: this.data?.content,
				statusGuestId: this.data?.statusGuestId,
				statusGuestName: this.data?.statusGuestName,
				adId: this.data?.adId,
				advertisementTitle: this.data?.ad.title
			});

			if (this.typeForm == 2) {
				this.form.disable();
			}
		}
	}
	submit() {
		console.log('form',this.form.invalid);
		if (this.form.invalid) {

			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.guestId
		});
	}
	closeModal() {
		this.form.reset();
		this.close.emit();
	}
}

