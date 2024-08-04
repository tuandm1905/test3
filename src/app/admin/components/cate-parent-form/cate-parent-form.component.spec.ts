import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateParentFormComponent } from './cate-parent-form.component';

describe('CateParentFormComponent', () => {
  let component: CateParentFormComponent;
  let fixture: ComponentFixture<CateParentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CateParentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CateParentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
