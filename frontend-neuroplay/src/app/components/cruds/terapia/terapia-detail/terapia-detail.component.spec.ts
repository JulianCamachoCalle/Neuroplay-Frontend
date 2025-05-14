import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapiaDetailComponent } from './terapia-detail.component';

describe('TerapiaDetailComponent', () => {
  let component: TerapiaDetailComponent;
  let fixture: ComponentFixture<TerapiaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapiaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapiaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
