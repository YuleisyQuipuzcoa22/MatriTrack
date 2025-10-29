import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVerDetalles } from './consulta-ver-detalles';

describe('ConsultaVerDetalles', () => {
  let component: ConsultaVerDetalles;
  let fixture: ComponentFixture<ConsultaVerDetalles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaVerDetalles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaVerDetalles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
