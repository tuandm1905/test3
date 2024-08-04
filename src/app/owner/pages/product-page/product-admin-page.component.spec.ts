import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminPageComponent } from './product-admin-page.component';

describe('ProductAdminPageComponent', () => {
  let component: ProductAdminPageComponent;
  let fixture: ComponentFixture<ProductAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductAdminPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
