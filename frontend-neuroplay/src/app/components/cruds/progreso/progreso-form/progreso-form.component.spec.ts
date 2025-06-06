import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoFormComponent } from './progreso-form.component';

describe('ProgresoFormComponent', () => {
  let component: ProgresoFormComponent;
  let fixture: ComponentFixture<ProgresoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgresoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
