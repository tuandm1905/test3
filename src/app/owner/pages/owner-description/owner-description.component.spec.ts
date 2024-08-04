import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDescriptionComponent } from './owner-description.component';

describe('OwnerDescriptionComponent', () => {
  let component: OwnerDescriptionComponent;
  let fixture: ComponentFixture<OwnerDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
