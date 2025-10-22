import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPacienteHistorial } from './crear-paciente-historial';

describe('CrearPacienteHistorial', () => {
  let component: CrearPacienteHistorial;
  let fixture: ComponentFixture<CrearPacienteHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPacienteHistorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPacienteHistorial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
