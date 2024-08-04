import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-details-page',
  templateUrl: './blog-details-page.component.html',
  styleUrl: './blog-details-page.component.scss'
})
export class BlogDetailsPageComponent {
  constructor(private router: Router) { }

  contactUs() {
    this.router.navigate(['/call-for-service']);
  }
}
