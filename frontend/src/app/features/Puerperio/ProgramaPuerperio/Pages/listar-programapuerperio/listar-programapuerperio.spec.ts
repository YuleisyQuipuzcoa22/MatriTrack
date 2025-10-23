import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProgramapuerperio } from './listar-programapuerperio';

describe('ListarProgramapuerperio', () => {
  let component: ListarProgramapuerperio;
  let fixture: ComponentFixture<ListarProgramapuerperio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProgramapuerperio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProgramapuerperio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
