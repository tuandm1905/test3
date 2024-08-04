import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-wrapper',
  templateUrl: './box-wrapper.component.html',
  styleUrl: './box-wrapper.component.scss'
})
export class BoxWrapperComponent {
  @Input() className: string = "";
}
