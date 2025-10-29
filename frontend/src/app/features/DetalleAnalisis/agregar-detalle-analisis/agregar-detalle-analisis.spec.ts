import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDetalleAnalisis } from './agregar-detalle-analisis';

describe('AgregarDetalleAnalisis', () => {
  let component: AgregarDetalleAnalisis;
  let fixture: ComponentFixture<AgregarDetalleAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarDetalleAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarDetalleAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
