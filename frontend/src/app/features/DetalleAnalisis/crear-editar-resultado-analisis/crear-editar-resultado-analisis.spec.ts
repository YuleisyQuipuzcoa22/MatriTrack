import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarResultadoAnalisis } from './crear-editar-resultado-analisis';

describe('CrearEditarResultadoAnalisis', () => {
  let component: CrearEditarResultadoAnalisis;
  let fixture: ComponentFixture<CrearEditarResultadoAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarResultadoAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarResultadoAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
