import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Qrcode2Component } from './qrcode2.component';

describe('Qrcode2Component', () => {
  let component: Qrcode2Component;
  let fixture: ComponentFixture<Qrcode2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Qrcode2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Qrcode2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
