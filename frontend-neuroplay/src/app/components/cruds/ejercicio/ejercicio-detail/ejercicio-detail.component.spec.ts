import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioDetailComponent } from './ejercicio-detail.component';

describe('EjercicioDetailComponent', () => {
  let component: EjercicioDetailComponent;
  let fixture: ComponentFixture<EjercicioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
