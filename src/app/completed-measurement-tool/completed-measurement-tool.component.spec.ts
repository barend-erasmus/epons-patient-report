import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedMeasurementToolComponent } from './completed-measurement-tool.component';

describe('CompletedMeasurementToolComponent', () => {
  let component: CompletedMeasurementToolComponent;
  let fixture: ComponentFixture<CompletedMeasurementToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedMeasurementToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedMeasurementToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
