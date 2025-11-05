import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarControl } from './crear-editar-control';

describe('CrearEditarControl', () => {
  let component: CrearEditarControl;
  let fixture: ComponentFixture<CrearEditarControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
