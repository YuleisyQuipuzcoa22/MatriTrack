import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramasHistorialmedico } from './programas-historialmedico';

describe('ProgramasHistorialmedico', () => {
  let component: ProgramasHistorialmedico;
  let fixture: ComponentFixture<ProgramasHistorialmedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramasHistorialmedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramasHistorialmedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
