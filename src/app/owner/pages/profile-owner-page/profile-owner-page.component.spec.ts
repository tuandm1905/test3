import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOwnerPageComponent } from './profile-owner-page.component';

describe('ProfileOwnerPageComponent', () => {
  let component: ProfileOwnerPageComponent;
  let fixture: ComponentFixture<ProfileOwnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileOwnerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileOwnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
