import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmar-contrasenia',
  templateUrl: './confirmar-contrasenia.component.html',
  styleUrl: './confirmar-contrasenia.component.css'
})
export class ConfirmarContraseniaComponent {

  @Input() contraseniaCorrecta:string='';
  @Output() fallo = new EventEmitter<boolean>();
  @Output() cerrar = new EventEmitter<boolean>();
  contraseniaIngresada:string=''
  
  confirmar(){
    console.log(this.contraseniaCorrecta)
    console.log(this.contraseniaIngresada)
    if (this.contraseniaCorrecta==this.contraseniaIngresada) {
      this.fallo.emit(false)
      this.cerrar.emit(true)
    }else{
      alert('Contraseña incorrecta')
    }
  }
  salir(){
    this.fallo.emit(true)
    this.cerrar.emit(true)
  }
}
