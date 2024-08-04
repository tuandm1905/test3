import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDescriptionFormComponent } from './owner-description-form.component';

describe('OwnerDescriptionFormComponent', () => {
  let component: OwnerDescriptionFormComponent;
  let fixture: ComponentFixture<OwnerDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerDescriptionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
