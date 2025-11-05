import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarControles } from './listar-controles';

describe('ListarControles', () => {
  let component: ListarControles;
  let fixture: ComponentFixture<ListarControles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarControles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarControles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
