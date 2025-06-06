import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionListComponent } from './sesion-list.component';

describe('SesionListComponent', () => {
  let component: SesionListComponent;
  let fixture: ComponentFixture<SesionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
