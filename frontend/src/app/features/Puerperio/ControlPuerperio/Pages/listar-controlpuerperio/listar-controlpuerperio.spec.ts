import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarControlpuerperio } from './listar-controlpuerperio';

describe('ListarControlpuerperio', () => {
  let component: ListarControlpuerperio;
  let fixture: ComponentFixture<ListarControlpuerperio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarControlpuerperio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarControlpuerperio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
