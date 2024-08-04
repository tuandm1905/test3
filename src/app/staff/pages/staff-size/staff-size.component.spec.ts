import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSizeComponent } from './staff-size.component';

describe('StaffSizeComponent', () => {
  let component: StaffSizeComponent;
  let fixture: ComponentFixture<StaffSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffSizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
