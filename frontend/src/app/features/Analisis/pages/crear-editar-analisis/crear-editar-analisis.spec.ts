import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarAnalisis } from './crear-editar-analisis';

describe('CrearEditarAnalisis', () => {
  let component: CrearEditarAnalisis;
  let fixture: ComponentFixture<CrearEditarAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
