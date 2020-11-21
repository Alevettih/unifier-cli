import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNewPasswordFormComponent } from './set-new-password-form.component';

describe('SetNewPasswordFormComponent', () => {
  let component: SetNewPasswordFormComponent;
  let fixture: ComponentFixture<SetNewPasswordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetNewPasswordFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetNewPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
