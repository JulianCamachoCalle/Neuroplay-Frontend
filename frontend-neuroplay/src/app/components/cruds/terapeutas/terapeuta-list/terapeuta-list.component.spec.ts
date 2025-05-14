import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapeutaListComponent } from './terapeuta-list.component';

describe('TerapeutaListComponent', () => {
  let component: TerapeutaListComponent;
  let fixture: ComponentFixture<TerapeutaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapeutaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapeutaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
