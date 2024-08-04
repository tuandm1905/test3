import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../helpers/common.service";
import {AlertService} from "../../../helpers/alert.service";

@Component({
    selector: 'app-add-new-brand',
    templateUrl: './add-new-brand.component.html',
    styleUrls: ['./add-new-brand.component.scss']
})
export class AddNewBrandComponent {
    @Input() modalTitle: string = '';
    @Input() categories: any;
    @Input() isVisible: boolean = false;
    @Output() save = new EventEmitter<any>();
    @Output() close = new EventEmitter<void>();

    form = new FormGroup({
        Name: new FormControl(null, Validators.required),
        Image: new FormControl(null, Validators.required),
        CategoryId: new FormControl(null, Validators.required),
    });

    constructor(
        public commonService: CommonService,
        private alertService: AlertService
    ) {

    }

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		if(!this.isVisible) {
			this.form.reset();
		}
	}

    saveBrand() {
        if(this.form.invalid) {
            this.alertService.fireSmall('error', "Form Brand is invalid");
            return;
        }
        this.save.emit({
            form: this.form.value,
            id: null
        });
    }

    closeModal() {
        this.form.reset();

        this.close.emit();
    }
}
