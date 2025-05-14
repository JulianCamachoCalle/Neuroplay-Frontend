import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapiaFormComponent } from './terapia-form.component';

describe('TerapiaFormComponent', () => {
  let component: TerapiaFormComponent;
  let fixture: ComponentFixture<TerapiaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapiaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapiaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
