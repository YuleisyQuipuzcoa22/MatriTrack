import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoHistorialmedico } from './listado-historialmedico';

describe('ListadoHistorialmedico', () => {
  let component: ListadoHistorialmedico;
  let fixture: ComponentFixture<ListadoHistorialmedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoHistorialmedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoHistorialmedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
