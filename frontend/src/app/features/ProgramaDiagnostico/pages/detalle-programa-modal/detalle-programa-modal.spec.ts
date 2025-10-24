import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProgramaModal } from './detalle-programa-modal';

describe('DetalleProgramaModal', () => {
  let component: DetalleProgramaModal;
  let fixture: ComponentFixture<DetalleProgramaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleProgramaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleProgramaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
