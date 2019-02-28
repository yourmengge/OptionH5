import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlePageComponent } from './settle-page.component';

describe('SettlePageComponent', () => {
  let component: SettlePageComponent;
  let fixture: ComponentFixture<SettlePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
