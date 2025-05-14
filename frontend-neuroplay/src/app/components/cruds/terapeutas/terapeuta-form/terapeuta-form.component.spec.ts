import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapeutaFormComponent } from './terapeuta-form.component';

describe('TerapeutaFormComponent', () => {
  let component: TerapeutaFormComponent;
  let fixture: ComponentFixture<TerapeutaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapeutaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapeutaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
