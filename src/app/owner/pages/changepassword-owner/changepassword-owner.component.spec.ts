import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasswordOwnerComponent } from './changepassword-owner.component';

describe('ChangepasswordOwnerComponent', () => {
  let component: ChangepasswordOwnerComponent;
  let fixture: ComponentFixture<ChangepasswordOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangepasswordOwnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangepasswordOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
