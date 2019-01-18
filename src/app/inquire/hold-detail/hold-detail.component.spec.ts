import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldDetailComponent } from './hold-detail.component';

describe('HoldDetailComponent', () => {
  let component: HoldDetailComponent;
  let fixture: ComponentFixture<HoldDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
