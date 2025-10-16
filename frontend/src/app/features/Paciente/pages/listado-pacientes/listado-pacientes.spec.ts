import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPacientes } from './listado-pacientes';

describe('ListadoPacientes', () => {
  let component: ListadoPacientes;
  let fixture: ComponentFixture<ListadoPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
