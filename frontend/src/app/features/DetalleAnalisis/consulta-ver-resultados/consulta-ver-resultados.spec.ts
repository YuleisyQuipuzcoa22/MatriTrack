import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaVerResultados } from './consulta-ver-resultados';

describe('ConsultaVerResultados', () => {
  let component: ConsultaVerResultados;
  let fixture: ComponentFixture<ConsultaVerResultados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaVerResultados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaVerResultados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
