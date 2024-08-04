import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportproductDetailComponent } from './importproduct-detail.component';

describe('ImportproductDetailComponent', () => {
  let component: ImportproductDetailComponent;
  let fixture: ComponentFixture<ImportproductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportproductDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportproductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
