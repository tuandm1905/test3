import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCateParentFormComponent } from './owner-cate-parent-form.component';

describe('OwnerCateParentFormComponent', () => {
  let component: OwnerCateParentFormComponent;
  let fixture: ComponentFixture<OwnerCateParentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerCateParentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerCateParentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
