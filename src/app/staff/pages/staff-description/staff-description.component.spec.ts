import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDescriptionComponent } from './staff-description.component';

describe('StaffDescriptionComponent', () => {
  let component: StaffDescriptionComponent;
  let fixture: ComponentFixture<StaffDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
