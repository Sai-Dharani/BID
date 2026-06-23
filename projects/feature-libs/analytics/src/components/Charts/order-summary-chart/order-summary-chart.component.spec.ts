import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSummaryChartComponent } from './order-summary-chart.component';

describe('OrderSummaryChartComponent', () => {
  let component: OrderSummaryChartComponent;
  let fixture: ComponentFixture<OrderSummaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSummaryChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
