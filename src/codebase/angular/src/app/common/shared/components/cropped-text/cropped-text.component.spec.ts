import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CroppedTextComponent } from './cropped-text.component';

describe('CroppedTextComponent', () => {
  let component: CroppedTextComponent;
  let fixture: ComponentFixture<CroppedTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CroppedTextComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CroppedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
