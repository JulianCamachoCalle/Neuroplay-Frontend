import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoDetailComponent } from './progreso-detail.component';

describe('ProgresoDetailComponent', () => {
  let component: ProgresoDetailComponent;
  let fixture: ComponentFixture<ProgresoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
