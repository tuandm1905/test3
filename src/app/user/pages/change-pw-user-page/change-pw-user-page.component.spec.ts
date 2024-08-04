import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePwUserPageComponent } from './change-pw-user-page.component';

describe('ChangePwUserPageComponent', () => {
  let component: ChangePwUserPageComponent;
  let fixture: ComponentFixture<ChangePwUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePwUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangePwUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
