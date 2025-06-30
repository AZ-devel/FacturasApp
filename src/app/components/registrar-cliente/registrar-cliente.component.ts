import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from '../../Models/Entities.model';
import { SFacturasService } from '../../services/sfacturas.service';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';



@Component({
  selector: 'app-registrar-cliente',
  templateUrl: './registrar-cliente.component.html',
  styleUrl: './registrar-cliente.component.scss'
})
export class RegistrarClienteComponent {

  constructor(public fb: FormBuilder, public rutar: Router, private sFacturas: SFacturasService, private auth: AuthService) { }

  clienteCrear: Usuarios = new Usuarios(0, '', '', '', '', '', new Date(Date.now()), '', '', 3)

  registroForm: FormGroup = this.fb.group({
    cedula: ['', [Validators.required, Validators.pattern('[0-9]{10}'), cedulaValidator()]],
    nombre: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
    apellido: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
    direccion: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    correo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$')]],
    password: ['', [Validators.required, Validators.minLength(4), passwordValidator()]],
  });

  CrearCliente() {
    this.clienteCrear.cedula = String(this.registroForm.get('cedula')?.value);
    this.clienteCrear.nombre = this.registroForm.get('nombre')?.value;
    this.clienteCrear.apellido = this.registroForm.get('apellido')?.value;
    this.clienteCrear.direccion = this.registroForm.get('direccion')?.value;
    this.clienteCrear.telefono = String(this.registroForm.get('telefono')?.value);
    this.clienteCrear.email = this.registroForm.get('correo')?.value;
    this.clienteCrear.password = this.registroForm.get('password')?.value;

    console.log(this.clienteCrear)

    this.sFacturas.crearUsuario(this.clienteCrear).subscribe(
      cli => {
        if (cli.esCorrecto) {
          this.auth.register(this.clienteCrear.email, this.clienteCrear.password)
            .then(respuesta => {
              respuesta.user.getIdToken().then(
                token => {                  
                  alert('Se ha creado correctamente la cuenta')
                  this.rutar.navigateByUrl('/login')
                });
            }
            );
        } else {
          alert(cli.mensaje);
        }
      },
      error => {
        alert('No se ha podido crear el cliente (servidor)')
        console.log(error)
      }
    )
  }
}


function passwordValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const password = control.value;

    if (!password) return null;

    const hasUpperCase = /[A-Z]+/.test(password);
    if (!hasUpperCase) return { noUpperCase: true };

    const hasLowerCase = /[a-z]+/.test(password);
    if (!hasLowerCase) return { noLowerCase: true };

    const hasNumeric = /[0-9]+/.test(password);
    if (!hasNumeric) return { noNumeric: true };

    const hasSpecialCaracters = /[\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+/.test(password);
    if (!hasSpecialCaracters) return { noSpecialCaracters: true };
    
    return null

  };

}

function cedulaValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const cedula = control.value;

    if (!cedula) return null;    
    
    if (!SFacturasService.verifyCedulaEcuador(cedula)) return { noCorrect: true };
    console.log(SFacturasService.verifyCedulaEcuador(cedula))
    
    return null

  };
}


