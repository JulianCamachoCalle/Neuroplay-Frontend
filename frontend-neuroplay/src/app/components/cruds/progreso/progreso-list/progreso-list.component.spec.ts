import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoListComponent } from './progreso-list.component';

describe('ProgresoListComponent', () => {
  let component: ProgresoListComponent;
  let fixture: ComponentFixture<ProgresoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
