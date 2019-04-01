import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlipaymentComponent } from './alipayment.component';

describe('AlipaymentComponent', () => {
  let component: AlipaymentComponent;
  let fixture: ComponentFixture<AlipaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlipaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlipaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
