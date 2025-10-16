import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarPaciente } from './crear-editar-paciente';

describe('CrearEditarPaciente', () => {
  let component: CrearEditarPaciente;
  let fixture: ComponentFixture<CrearEditarPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarPaciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
