import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSizeFormComponent } from './owner-size-form.component';

describe('OwnerSizeFormComponent', () => {
  let component: OwnerSizeFormComponent;
  let fixture: ComponentFixture<OwnerSizeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerSizeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerSizeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
