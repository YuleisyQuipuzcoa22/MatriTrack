import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarProgramapuerperio } from './crear-editar-programapuerperio';

describe('CrearEditarProgramapuerperio', () => {
  let component: CrearEditarProgramapuerperio;
  let fixture: ComponentFixture<CrearEditarProgramapuerperio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarProgramapuerperio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarProgramapuerperio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
