import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarProductsComponent } from './side-bar-products.component';

describe('SideBarProductsComponent', () => {
  let component: SideBarProductsComponent;
  let fixture: ComponentFixture<SideBarProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideBarProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideBarProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
