import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrl: './breadcrum.component.scss'
})
export class BreadcrumComponent {
  @Input() items: any[] = [];
}
