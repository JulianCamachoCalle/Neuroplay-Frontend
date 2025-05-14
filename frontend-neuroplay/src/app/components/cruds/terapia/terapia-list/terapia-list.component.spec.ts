import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapiaListComponent } from './terapia-list.component';

describe('TerapiaListComponent', () => {
  let component: TerapiaListComponent;
  let fixture: ComponentFixture<TerapiaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapiaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
