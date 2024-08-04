import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCateParentFormComponent } from './staff-cate-parent-form.component';

describe('StaffCateParentFormComponent', () => {
  let component: StaffCateParentFormComponent;
  let fixture: ComponentFixture<StaffCateParentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffCateParentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffCateParentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
