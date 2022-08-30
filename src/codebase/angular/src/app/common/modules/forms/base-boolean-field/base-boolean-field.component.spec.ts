import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBooleanFieldComponent } from './base-boolean-field.component';

describe('BaseCheckboxComponent', () => {
  let component: BaseBooleanFieldComponent;
  let fixture: ComponentFixture<BaseBooleanFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseBooleanFieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBooleanFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
