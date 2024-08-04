import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCodeUserComponent } from './verify-code-user.component';

describe('VerifyCodeUserComponent', () => {
  let component: VerifyCodeUserComponent;
  let fixture: ComponentFixture<VerifyCodeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyCodeUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyCodeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
