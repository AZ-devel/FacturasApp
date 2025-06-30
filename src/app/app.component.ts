import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SFacturasService } from './services/sfacturas.service';
import { Usuarios } from './Models/Entities.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  title = 'ClienteFacturas';
  constructor(private authService:AuthService, private sfacturas:SFacturasService){}

  esAdmin:boolean=false
  estaLogueado(){
    return this.authService.estaLogeado();
  }
  cerrarSesion(){
    this.authService.cerrarSesion();
  }
  validarAdmin(){
    return this.sfacturas.obtenerAdmin()=='true'?true:false;
    //return SFacturasService.esAdmin;
  //   this.sfacturas.retornarUsuarioPorEmail(this.sfacturas.obtenerEmail()).subscribe(
  //     respuesta=>{
  //       if (respuesta.esCorrecto) {
  //         let usu=respuesta.valor as Usuarios
  //         this.esAdmin = usu.rolID==1?true:false
  //       }else{
  //         console.log(respuesta.mensaje)
  //       }
  //     },error=>{
  //       console.log(error)
  //     }
  //   )
   }
  
}
