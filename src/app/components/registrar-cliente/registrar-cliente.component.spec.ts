import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarClienteComponent } from './registrar-cliente.component';

describe('RegistrarClienteComponent', () => {
  let component: RegistrarClienteComponent;
  let fixture: ComponentFixture<RegistrarClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
