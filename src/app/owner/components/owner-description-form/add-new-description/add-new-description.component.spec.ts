import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDescriptionComponent } from './add-new-description.component';

describe('AddNewDescriptionComponent', () => {
  let component: AddNewDescriptionComponent;
  let fixture: ComponentFixture<AddNewDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
