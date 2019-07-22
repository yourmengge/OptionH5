import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartETFComponent } from './chart-etf.component';

describe('ChartETFComponent', () => {
  let component: ChartETFComponent;
  let fixture: ComponentFixture<ChartETFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartETFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartETFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
