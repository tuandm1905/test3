import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDescriptionFormComponent } from './staff-description-form.component';

describe('StaffDescriptionFormComponent', () => {
  let component: StaffDescriptionFormComponent;
  let fixture: ComponentFixture<StaffDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffDescriptionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
