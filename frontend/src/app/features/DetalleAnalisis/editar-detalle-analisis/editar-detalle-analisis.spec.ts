import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDetalleAnalisis } from './editar-detalle-analisis';

describe('EditarDetalleAnalisis', () => {
  let component: EditarDetalleAnalisis;
  let fixture: ComponentFixture<EditarDetalleAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDetalleAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDetalleAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
