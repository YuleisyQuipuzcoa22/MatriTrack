import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarProgDiagnostico } from './crear-editar-prog-diagnostico';

describe('CrearEditarProgDiagnostico', () => {
  let component: CrearEditarProgDiagnostico;
  let fixture: ComponentFixture<CrearEditarProgDiagnostico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarProgDiagnostico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarProgDiagnostico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
