import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestconsultationPageComponent } from './guestconsultation-page.component';

describe('GuestconsultationPageComponent', () => {
  let component: GuestconsultationPageComponent;
  let fixture: ComponentFixture<GuestconsultationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestconsultationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestconsultationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
