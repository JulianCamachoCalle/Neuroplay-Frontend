import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionDetailComponent } from './sesion-detail.component';

describe('SesionDetailComponent', () => {
  let component: SesionDetailComponent;
  let fixture: ComponentFixture<SesionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
