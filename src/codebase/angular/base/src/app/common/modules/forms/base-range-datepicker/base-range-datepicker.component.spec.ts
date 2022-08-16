import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseRangeDatepickerComponent } from './base-range-datepicker.component';

describe('BaseDatepickerComponent', () => {
  let component: BaseRangeDatepickerComponent;
  let fixture: ComponentFixture<BaseRangeDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseRangeDatepickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRangeDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
