import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarImagenesComponent } from './editar-imagenes.component';

describe('EditarImagenesComponent', () => {
  let component: EditarImagenesComponent;
  let fixture: ComponentFixture<EditarImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarImagenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
