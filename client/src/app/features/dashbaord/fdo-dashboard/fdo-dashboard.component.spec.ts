import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdoDashboardComponent } from './fdo-dashboard.component';

describe('FdoDashboardComponent', () => {
  let component: FdoDashboardComponent;
  let fixture: ComponentFixture<FdoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
