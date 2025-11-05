import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDetallesAnalisis } from './listar-detalles-analisis';

describe('ListarDetallesAnalisis', () => {
  let component: ListarDetallesAnalisis;
  let fixture: ComponentFixture<ListarDetallesAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDetallesAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDetallesAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
