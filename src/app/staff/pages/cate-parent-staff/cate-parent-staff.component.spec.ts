import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateParentStaffComponent } from './cate-parent-staff.component';

describe('CateParentStaffComponent', () => {
  let component: CateParentStaffComponent;
  let fixture: ComponentFixture<CateParentStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CateParentStaffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CateParentStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
