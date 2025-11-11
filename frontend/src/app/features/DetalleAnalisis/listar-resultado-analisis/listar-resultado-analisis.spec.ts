import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarResultadoAnalisis } from './listar-resultado-analisis';

describe('ListarResultadoAnalisis', () => {
  let component: ListarResultadoAnalisis;
  let fixture: ComponentFixture<ListarResultadoAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarResultadoAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarResultadoAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
