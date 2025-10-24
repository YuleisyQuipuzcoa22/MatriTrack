import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizaProgramaModal } from './finaliza-programa-modal';

describe('FinalizaProgramaModal', () => {
  let component: FinalizaProgramaModal;
  let fixture: ComponentFixture<FinalizaProgramaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizaProgramaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizaProgramaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
