import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PSHeaderComponent } from './psheader.component';

describe('PSHeaderComponent', () => {
  let component: PSHeaderComponent;
  let fixture: ComponentFixture<PSHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PSHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PSHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
