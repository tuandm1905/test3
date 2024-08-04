import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSizeFormComponent } from './staff-size-form.component';

describe('StaffSizeFormComponent', () => {
  let component: StaffSizeFormComponent;
  let fixture: ComponentFixture<StaffSizeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffSizeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffSizeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
