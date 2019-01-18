import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointDetailComponent } from './appoint-detail.component';

describe('AppointDetailComponent', () => {
  let component: AppointDetailComponent;
  let fixture: ComponentFixture<AppointDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
