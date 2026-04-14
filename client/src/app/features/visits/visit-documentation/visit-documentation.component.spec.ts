import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDocumentationComponent } from './visit-documentation.component';

describe('VisitDocumentationComponent', () => {
  let component: VisitDocumentationComponent;
  let fixture: ComponentFixture<VisitDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitDocumentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
