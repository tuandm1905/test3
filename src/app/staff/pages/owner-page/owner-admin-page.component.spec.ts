import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerAdminPageComponent } from './owner-admin-page.component';

describe('OwnerAdminPageComponent', () => {
  let component: OwnerAdminPageComponent;
  let fixture: ComponentFixture<OwnerAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerAdminPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
