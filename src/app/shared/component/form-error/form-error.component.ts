import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
	@Input() control: any;
	@Input() submitted: any;
	@Input() validation: string = '';
	@Input() message: string = '';
}
