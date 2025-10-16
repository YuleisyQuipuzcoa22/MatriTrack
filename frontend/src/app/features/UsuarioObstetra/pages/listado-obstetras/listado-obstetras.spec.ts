import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoObstetras } from './listado-obstetras';

describe('ListarObstetras', () => {
  let component: ListadoObstetras;
  let fixture: ComponentFixture<ListadoObstetras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoObstetras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoObstetras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
