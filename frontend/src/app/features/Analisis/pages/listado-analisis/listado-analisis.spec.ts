import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAnalisis } from './listado-analisis';

describe('ListadoAnalisis', () => {
  let component: ListadoAnalisis;
  let fixture: ComponentFixture<ListadoAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
