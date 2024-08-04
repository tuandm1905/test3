import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSizeComponent } from './owner-size.component';

describe('OwnerSizeComponent', () => {
  let component: OwnerSizeComponent;
  let fixture: ComponentFixture<OwnerSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerSizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
