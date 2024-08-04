import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportproductPageComponent } from './importproduct-page.component';

describe('ImportproductPageComponent', () => {
  let component: ImportproductPageComponent;
  let fixture: ComponentFixture<ImportproductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportproductPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportproductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
