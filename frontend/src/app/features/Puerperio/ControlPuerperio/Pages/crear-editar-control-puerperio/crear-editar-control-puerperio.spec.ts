import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarControlPuerperio } from './crear-editar-control-puerperio';

describe('CrearEditarControlPuerperio', () => {
  let component: CrearEditarControlPuerperio;
  let fixture: ComponentFixture<CrearEditarControlPuerperio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarControlPuerperio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarControlPuerperio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
