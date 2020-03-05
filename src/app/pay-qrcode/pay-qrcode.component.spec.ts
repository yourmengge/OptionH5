import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayQrcodeComponent } from './pay-qrcode.component';

describe('PayQrcodeComponent', () => {
  let component: PayQrcodeComponent;
  let fixture: ComponentFixture<PayQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
