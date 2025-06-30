import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../Models/Entities.model';
import { Init } from 'v8';
import { SFacturasService } from '../../services/sfacturas.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  usuarioConectado: Usuarios = new Usuarios(0, '', '', '', '', '', new Date(Date.now()), '', '', 0);
  formularioValido: boolean = false
  fallaContrasenia: boolean = true
  cerrarValidacionContrasenia: boolean = true
  contraseniaLegitima: string = ''

  constructor(private sFacturas: SFacturasService, public router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.sFacturas.retornarUsuarioPorEmail(this.sFacturas.obtenerEmail()).subscribe(
      respuesta => {
        if (respuesta.esCorrecto) {
          this.usuarioConectado = respuesta.valor as Usuarios;
          this.contraseniaLegitima = this.usuarioConectado.password
          console.log(this.usuarioConectado)
        } else {
          console.log(respuesta.mensaje)
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  guardarDatos() {
    if (!this.validarCaracter(this.usuarioConectado.password) || !this.validarNumero(this.usuarioConectado.password) || !this.validarMinuscula(this.usuarioConectado.password) || !this.validarMayuscula(this.usuarioConectado.password) || !this.validarLength(this.usuarioConectado.password, 4)) {
      alert('No todas las validaciones estan hechas')
      return
    }
    this.sFacturas.actualizarUsuario(this.usuarioConectado).subscribe(
      respuesta => {
        if (respuesta.esCorrecto) {

          this.auth.cambiarContrasena(this.usuarioConectado.email, this.contraseniaLegitima, this.usuarioConectado.password)
            .then(() => {
              alert('Correcto')

            }).catch(
              error => { alert('No se actualizo el usuario FB'); console.log('Error Firebase', error) }
            );


        } else {
          alert('No se ha actualizado el usuario')
          console.log(respuesta.mensaje)
        }
      }, error => {
        alert('No se ha actualizado el usuario(s)')
        console.log(error)
      }
    )
  }
  validarLetras(texto: string): boolean {
    const regexLetras = /^[A-Za-z]+$/;
    let resultado = !regexLetras.test(texto) && texto.length > 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false

    return resultado
  }
  validarNumeros(texto: string): boolean {
    const regexNumeros = /^\d+$/;
    let resultado = !regexNumeros.test(texto) && texto.length > 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }
  validarTelefono(texto: string): boolean {
    let resultado = texto.length > 0 && texto.length < 10 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false

    return resultado
  }
  validarLength(texto: string, min: number) {
    let resultado = texto.length > 0 && texto.length < min ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }
  validarCampoRequerido(texto: string): boolean {
    let resultado = texto.length == 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarMayuscula(texto: string) {
    const regexNumeros = /[A-Z]+/;
    let resultado = !regexNumeros.test(texto) && texto.length > 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }
  validarMinuscula(texto: string) {
    const regexNumeros = /[a-z]+/;
    let resultado = !regexNumeros.test(texto) && texto.length > 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }
  validarNumero(texto: string) {
    const regexNumeros = /[0-9]+/;
    let resultado = !regexNumeros.test(texto) && texto.length > 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }
  validarCaracter(texto: string) {
    const regexNumeros = /[\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+/;
    let resultado = !regexNumeros.test(texto) && texto.length > 0 ? false : true
    this.formularioValido = this.validarRequeridos() == true ? resultado : false
    return resultado
  }

  validarRequeridos() {
    let resultado = this.usuarioConectado.password.length == 0 || this.usuarioConectado.nombre.length == 0 || this.usuarioConectado.apellido.length == 0 || this.usuarioConectado.direccion.length == 0 || this.usuarioConectado.telefono.length == 0 ? false : true
    this.formularioValido = resultado
    return resultado
  }

}
