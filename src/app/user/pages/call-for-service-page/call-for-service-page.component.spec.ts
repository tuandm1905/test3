import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallForServicePageComponent } from './call-for-service-page.component';

describe('CallForServicePageComponent', () => {
  let component: CallForServicePageComponent;
  let fixture: ComponentFixture<CallForServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallForServicePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallForServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
