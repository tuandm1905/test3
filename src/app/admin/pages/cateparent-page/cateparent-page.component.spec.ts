import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateparentPageComponent } from './cateparent-page.component';

describe('CateparentPageComponent', () => {
  let component: CateparentPageComponent;
  let fixture: ComponentFixture<CateparentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CateparentPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CateparentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
