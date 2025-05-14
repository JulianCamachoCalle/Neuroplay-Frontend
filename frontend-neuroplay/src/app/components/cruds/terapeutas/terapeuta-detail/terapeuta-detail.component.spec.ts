import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapeutaDetailComponent } from './terapeuta-detail.component';

describe('TerapeutaDetailComponent', () => {
  let component: TerapeutaDetailComponent;
  let fixture: ComponentFixture<TerapeutaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapeutaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapeutaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
