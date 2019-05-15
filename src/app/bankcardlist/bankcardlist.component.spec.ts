import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankcardlistComponent } from './bankcardlist.component';

describe('BankcardlistComponent', () => {
  let component: BankcardlistComponent;
  let fixture: ComponentFixture<BankcardlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankcardlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankcardlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
