import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoTerapiaComponent } from './proceso-terapia.component';

describe('ProcesoTerapiaComponent', () => {
  let component: ProcesoTerapiaComponent;
  let fixture: ComponentFixture<ProcesoTerapiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoTerapiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoTerapiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
