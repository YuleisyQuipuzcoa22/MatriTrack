import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaDiagnosticoListComponent } from './programa-diagnostico-list.component';

describe('ProgramaDiagnosticoListComponent', () => {
  let component: ProgramaDiagnosticoListComponent;
  let fixture: ComponentFixture<ProgramaDiagnosticoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaDiagnosticoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaDiagnosticoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
