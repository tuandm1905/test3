import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAdminPageComponent } from './service-admin-page.component';

describe('ServiceAdminPageComponent', () => {
  let component: ServiceAdminPageComponent;
  let fixture: ComponentFixture<ServiceAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceAdminPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
