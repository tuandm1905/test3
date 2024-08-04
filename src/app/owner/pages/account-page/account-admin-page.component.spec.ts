import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdminPageComponent } from './account-admin-page.component';

describe('AccountAdminPageComponent', () => {
  let component: AccountAdminPageComponent;
  let fixture: ComponentFixture<AccountAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAdminPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
