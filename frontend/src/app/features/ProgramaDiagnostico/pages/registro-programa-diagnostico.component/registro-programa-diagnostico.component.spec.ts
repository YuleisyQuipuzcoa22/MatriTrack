import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProgramaDiagnosticoComponent } from './registro-programa-diagnostico.component';

describe('RegistroProgramaDiagnosticoComponent', () => {
  let component: RegistroProgramaDiagnosticoComponent;
  let fixture: ComponentFixture<RegistroProgramaDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroProgramaDiagnosticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroProgramaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
