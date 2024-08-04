import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserPageComponent } from './profile-user-page.component';

describe('ProfileUserPageComponent', () => {
  let component: ProfileUserPageComponent;
  let fixture: ComponentFixture<ProfileUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
