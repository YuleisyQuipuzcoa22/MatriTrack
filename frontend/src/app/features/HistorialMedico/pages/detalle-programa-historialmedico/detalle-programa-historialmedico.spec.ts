import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProgramaHistorialmedico } from './detalle-programa-historialmedico';

describe('DetalleProgramaHistorialmedico', () => {
  let component: DetalleProgramaHistorialmedico;
  let fixture: ComponentFixture<DetalleProgramaHistorialmedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleProgramaHistorialmedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleProgramaHistorialmedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
