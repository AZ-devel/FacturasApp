import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { SFacturasService } from '../../services/sfacturas.service';
import { Usuarios } from '../../Models/Entities.model';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent{
//  constructor(public ruta:Router, private authService:AuthService, private sFacturas:SFacturasService){}


//  login(form:NgForm){
//   const usuario= form.value.usuario;
//   const contraseña= form.value.contraseña;
//   this.sFacturas.retornarUsuarioPorEmail(usuario).subscribe(
//     respuesta=>{
//       if (respuesta.valor) {
//         let user=respuesta.valor as Usuarios
//         let contra=user.password
//         if ( user.password==contraseña && (user.rolID==3 || user.rolID==1)) {
//           this.authService.login(usuario,contraseña);
//           SFacturasService.esAdmin=user.rolID==1?true:false;
//           this.sFacturas.establecerAdmin(user.rolID==1?'true':'false')
//         }else{
//           alert('Contraseña Incorrecta')
//         }
//       }else{
//         alert('Credenciales incorrectas')
//         console.log(respuesta.mensaje)
//       }
//     },error=>{
//       alert('Credenciales incorrecta(s)')
//       console.log(error)
//     }
//   )
  
  
//  }
// }


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private intentosFallidos: number = 0; 

  constructor(
    public ruta: Router, 
    private authService: AuthService, 
    private sFacturas: SFacturasService
  ) {}

  login(form: NgForm) {
    const usuario = form.value.usuario;
    const contraseña = form.value.contraseña;

    this.sFacturas.retornarUsuarioPorEmail(usuario).subscribe(
      respuesta => {
        if (respuesta.valor) {
          let user = respuesta.valor as Usuarios;

          
          if (!user.activo) {
            alert('El usuario está bloqueado. Por favor, contacte al administrador.');
            return;
          }


          if (user.password == contraseña && (user.rolID == 3 || user.rolID == 1)) {

            this.intentosFallidos = 0;  // Reinicia los intentos fallidos


            this.authService.login(usuario, contraseña);
            SFacturasService.esAdmin = user.rolID == 1 ? true : false;
            this.sFacturas.establecerAdmin(user.rolID == 1 ? 'true' : 'false');
          } else {

            if (user.rolID == 3) {  
              this.intentosFallidos++;
              if (this.intentosFallidos >= 3) {
                
                user.activo = false;
                this.sFacturas.actualizarUsuario(user).subscribe(
                  () => {
                    alert('Su cuenta ha sido bloqueada después de tres intentos fallidos.');
                  },
                  error => {
                    console.error('Error al bloquear al usuario', error);
                  }
                );
              } else {
                alert('Contraseña incorrecta. Intento ' + this.intentosFallidos + ' de 3.');
              }
            } else {
              alert('Contraseña incorrecta.');
            }
          }
        } else {

          alert('Credenciales incorrectas o usuario bloqueado');
          console.log(respuesta.mensaje);
        }
      },
      error => {
        alert('Error en el inicio de sesión, cuenta bloqueada');
        console.log(error);
      }
    );
  }
}


