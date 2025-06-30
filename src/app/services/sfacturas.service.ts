import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuarios, Productos, Orden, DetOrdenes, Reporte, Respuesta } from './../Models/Entities.model'
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import e from 'express';

@Injectable({
  providedIn: 'root'
})
export class SFacturasService {
  //url:string="http://localhost:65294/SFacturas.svc"
  //url:string="http://localhost/SFacturas.svc"
  //url: string = "http://192.168.1.133/api"
  //url: string = "http://localhost/api"
  url: string = "http://localhost:5031/api"
  //url:string="http://serverpam.somee.com/api"
  static esAdmin:boolean=false
  constructor(private http: HttpClient, private cookie:CookieService){}

  //PRODUCTOS--------------------------------------------------------------------
  crearProducto(producto: Productos) {
    const cabecera = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Respuesta>(this.url + "/Productos/CrearProducto", producto, { headers: cabecera });
  }
  actualizarProducto(producto: Productos) {
    const cabecera = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Respuesta>(this.url + "/Productos/ActualizarProducto", producto, { headers: cabecera });
  }
  retornarProductos() {
    return this.http.get<Respuesta>(this.url + "/Productos/ListaProductos")
  }
  retornarProductosSinImagenes() {
    return this.http.get<Respuesta>(this.url + "/Productos/ListaProductosConUImg")
  }
  // eliminarProducto(idProducto:number){
  //   return this.http.delete<boolean>(this.url+"/EliminarProducto/"+idProducto)
  // }
  //USUARIOS--------------------------------------------------------------------
  crearUsuario(cliente: Usuarios){
    const cabecera = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Respuesta>(this.url + "/Usuarios/CrearUsuario", cliente, { headers: cabecera });
  }
  actualizarUsuario(cliente: Usuarios){
    const cabecera = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Respuesta>(this.url + "/Usuarios/ActualizarUsuario", cliente, { headers: cabecera });
  }
  // crearUsuarioFirebase(usuario: Usuarios, token_parameter?:string) {
  //   var token;
  //   if (token_parameter) {
  //     token = token_parameter;
  //   }else{
  //     token = this.authService.getIdToken();
  //   }
  //   return this.http.post('https://facturacion-app-5ae81-default-rtdb.firebaseio.com/datos.json?auth='+token, usuario);
  // }
  // actualizarUsuarioFirebase(indice: number, usuario:Usuarios) {
  //   return this.http.put('https://facturacion-app-5ae81-default-rtdb.firebaseio.com/datos/'+indice+'.json', usuario);
  // }
  // listarUsuariosFirebase() {
  //   const token = this.authService.getIdToken();
  //   return this.http.get('https://facturacion-app-5ae81-default-rtdb.firebaseio.com/datos.json?auth='+token);
  // }
  // eliminarUsuarioFirebase(indice: number) {
  //   return this.http.delete('https://facturacion-app-5ae81-default-rtdb.firebaseio.com/datos/'+indice+'.json');
  // }
  retornarUsuarios() {
    return this.http.get<Respuesta>(this.url + "/Usuarios/ListarUsuariosActivos")
  }
  retornarTodosUsuarios() {
    return this.http.get<Respuesta>(this.url + "/Usuarios/ListarTodosUsuarios")
  }
  retornarUsuarioPorEmail(email:string){
    return this.http.get<Respuesta>(this.url+"/Usuarios/ObtenerUsuarioxEmail"+email)
  }
   eliminarCliente(idCliente:number){    
     return this.http.delete<Respuesta>(this.url+"/Usuarios/EliminarUsuario"+idCliente)
   }

  //FACTURAS----------------------------------------------------------------------
  retornarFactura(id_orden: number) {
    return this.http.get<Respuesta>(this.url + "/OrdenVentas/DevolverOrdenVenta" + id_orden)
  }
  retornarDetalles(id_fac:number){    
    return this.http.get<Respuesta>(this.url+"/DetalleOrdenes/ListaDetallesOrdenVentaPorOV"+id_fac)
  }

  crearOrden(orden: Orden) {
    return this.http.post<Respuesta>(this.url + "/OrdenVentas/GuardarOrdenVenta", orden);
  }
  crearDetalle(detalle: DetOrdenes) {
    const cabecera = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<number>(this.url + "/DetalleOrdenes/GuardarDetalleOrden", detalle, { headers: cabecera });
  }
  //---------------
  InsertarProductos(listaProductos: DetOrdenes[]) {
    const cabecera = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<number>(this.url + "/InsertarProductos", listaProductos, { headers: cabecera });
  }
  listarOrdenes() {
    return this.http.get<Respuesta>(this.url + "/OrdenVentas/ListaOrdenesVentas")
  }
  listarReporte() {
    return this.http.get<Reporte>(this.url + "/ObtenerReporte")
  }
  // EliminarFactura(id_factura:number){
  //   return this.http.delete<boolean>(this.url+'/EliminarFactura/'+id_factura)
  // }
  //LOGS-------------------------
  listarLogs() {
    return this.http.get<Respuesta>(this.url + "/Error_Logs/ListarLogs")
  }

  //OTROS SERVICIOS-----------------------------
  establecerEmail(email:string){
    this.cookie.set('email',email)
  }
  obtenerEmail(){
    return this.cookie.get('email');
  }
  establecerAdmin(esAdmin:string){
    this.cookie.set('admin',esAdmin)
  }
  obtenerAdmin(){
    return this.cookie.get('admin');
  }

  static verifyCedulaEcuador = (id: string): Boolean => {
    let valid = true;
    let i = 0;
    let j = 0;
    let provincia = 0;
    let valorControl = 0;
    if (id.length > 0) {
      // this.cedula = this.player.cedula;
      if (id.length !== 10) {
        valid = false;
      }
      while (i < id.length - 1) {
        if (!/^([0-9])*$/.test(id.charAt(i))) {
          valid = false;
        }
        j = Number(id.charAt(i));
        if ((i + 1) % 2 !== 0) {
          j = j * 2;
          if (j > 9) {
            j = j - 9;
          }
        }
        valorControl = valorControl + j;
        i = i + 1;
      }
      // provincia
      provincia = Number(id.substring(0, 2));
      if (valorControl % 10 !== 0) {
        valorControl = 10 - (valorControl % 10);
      } else {
        valorControl = 0;
      }
      if (Number(id.charAt(i)) !== valorControl) {
        valid = false;
      }
      if ((provincia < 1 || provincia > 24) && provincia !== 30) {
        valid = false;
      }
    } else {
      valid = false;
    }
    return valid;
  };
}
