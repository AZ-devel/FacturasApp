import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Usuarios } from '../../Models/Entities.model';
import { SFacturasService } from '../../services/sfacturas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
imprimir() {
  console.log(this.activo)
  this.usuario.activo = this.activo === "true";
  console.log(this.usuario)
}
  usuario:Usuarios= new Usuarios(0, '', '', '', '', '', new Date(), '', '', 0)
  usuarios:Usuarios[]=[]
  usuariosCompletos:Usuarios[]=[]
  usuariosFiltrados:Usuarios[]=[]
  estaCreando:boolean=true;
  rol:string='4';
  activo:string='true'
  formularioValido:boolean=false
  filtro:string='';
  p: number = 1;
  esAdmin:boolean=false

  constructor(private factura:SFacturasService, private auth:AuthService){}  

  ngOnInit(): void {
    this.esAdmin=this.factura.obtenerAdmin()=='true'?true:false
    this.cambiaraCrear()
    this.factura.retornarTodosUsuarios().subscribe(
      respuesta=>{
        if (respuesta.esCorrecto) {
          this.usuarios=Object.values(respuesta.valor).filter((x:Usuarios)=>x.rolID==parseInt(this.rol))
          this.usuariosCompletos=Object.values(respuesta.valor)
          this.usuariosFiltrados= this.usuarios
        }else{
          console.log(respuesta.mensaje)
        }
      },
      error=>{
        console.log(error)
      }
    )
  }

  // pasarDatos(usuario:Usuarios){
  //   this.usuario=usuario
  //   this.usuario.activo=Boolean(this.activo)
  //   this.activo=String(this.usuario.activo);
  //   this.estaCreando=false;
  // }

  pasarDatos(usuario: Usuarios) {
    this.usuario = usuario;
    this.activo = String(this.usuario.activo);
    this.estaCreando = false;
  }

  cambiaraCrear() {
    this.usuario = new Usuarios(0, '', '', '', '', '', new Date(), '', '', 0)
    this.estaCreando = true; 
  }

  guardarCambios(){
      for (let i = 0; i < this.usuario.cedula.length; i++) {
        let entero:number = parseInt(this.usuario.cedula[i])
        if (isNaN(entero)) {
          alert('La cedula no puede contener letras')
          return
        }
        console.log(entero)
        console.log(this.usuario.cedula[i]) 
        console.log('si entro al for')       
      }
    
    this.usuario.fechaNacimiento=new Date(this.usuario.fechaNacimiento).toISOString()        
    this.usuario.telefono=String(this.usuario.telefono)

    //--
    this.usuario.activo= this.activo ==='true';

    if(this.estaCreando){      
      this.usuario.rolID=parseInt(this.rol);      
      this.usuario.password=this.usuario.cedula
      console.log(this.usuario)
      this.factura.crearUsuario(this.usuario).subscribe(
        cli => {
          if (cli.esCorrecto) {
            this.auth.register(this.usuario.email, this.usuario.password)
              .then(respuesta => {                                                   
                    alert('Se ha creado correctamente el usuario')
                    window.location.reload();                
              }
              );
          } else {
            alert('No se ha creado el usuario');
            console.log(cli.mensaje)
          }
        },
        error => {
          alert('No se ha podido crear el usuario (servidor)')
          console.log(error)
        }
      )
    }else{
      console.log(this.usuario)      
      this.factura.actualizarUsuario(this.usuario).subscribe(
        respuesta=>{
          if (respuesta.esCorrecto) {
            alert('Usuario actualizado exitosamente')
            window.location.reload();
          }else{
            alert('No se han guardado los cambios')
            console.log(respuesta.mensaje)
          }
        },
        error=>{
          alert('Error inesperado(server)')
          console.log(error)
        }
      )
    }    
  }

  formatoFecha(deLista:boolean, fechaLista?:string): string {
    let fecha;
    if (deLista && fechaLista) {
      fecha=new Date(fechaLista);
    }else{
      fecha=new Date(this.usuario.fechaNacimiento);
    }
    const año = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);  // Los meses son indexados en base cero
    const dia = ('0' + fecha.getDate()).slice(-2);
    return `${año}-${mes}-${dia}`;
  }

  EliminarUsuario(id_cli: number) {
    this.factura.eliminarCliente(id_cli).subscribe(
      elimino => {
        if (elimino.esCorrecto) {
          alert('usuario eliminado con exito')
          this.ngOnInit();
        } else {
          alert('No se pudo eliminar al cliente porque esta referenciado en una factura')
          console.log(elimino.mensaje)
        }
      },
      error => {
        console.log(error)
        alert('No se puede eliminar el cliente porque se encuentra referenciado en una factura')
      }
    )
  }

  BuscarClientes() {                
      this.usuariosFiltrados = this.usuarios.filter( 
      x=>x.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      x.usuarioID==parseInt(this.filtro) ||
      x.apellido.toLowerCase().includes(this.filtro.toLowerCase()) || 
      x.cedula.includes(this.filtro) || x.direccion.toLowerCase().includes(this.filtro.toLowerCase()) || 
      x.telefono.includes(this.filtro))
    
  }

  validarCorreo():boolean{
    let resultado=this.usuariosCompletos.find(x=>x.email==this.usuario.email) && this.estaCreando==true?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false     
    return resultado
  }
  validarCedula():boolean{
    let resulatado=this.usuariosCompletos.find(x=>x.cedula==this.usuario.cedula) && this.estaCreando==true?false:true
    this.formularioValido=this.validarRequeridos()==true?resulatado:false  
    return resulatado
  }
  validarLetras(texto:string):boolean{
    const regexLetras = /^[A-Za-z]+$/;
    let resultado=!regexLetras.test(texto) && texto.length>0 ?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false    
    
    return resultado
  }
  validarNumeros(texto:string):boolean{    
    const regexNumeros = /^\d+$/;        
    let resultado=!regexNumeros.test(texto) && texto.length>0?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false    
    
    return resultado
  }
  validarTelefono(texto:string):boolean{
    let resultado= texto.length>0 && texto.length<10?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false    
    
    return resultado
  }
  validarLength(texto:string, min:number){
    let resultado= texto.length>0 && texto.length<min?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false        
    return resultado
  }
  validarCorreoValido():boolean{
    const correoValidator=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/
    let resultado=!correoValidator.test(this.usuario.email) && this.estaCreando==true && this.usuario.email.length>0 ?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false    
    return resultado
  }
  validarCedulaCorrecta():boolean{    
    let resultado= !SFacturasService.verifyCedulaEcuador(this.usuario.cedula) && this.usuario.cedula.length>0 && this.estaCreando==true?false:true
    this.formularioValido=this.validarRequeridos()==true?resultado:false       
    return resultado
  }
  validarRequeridos(){
    let resultado=this.usuario.cedula.length==0 || this.usuario.email.length==0 || this.usuario.nombre.length==0 || this.usuario.apellido.length==0 || this.usuario.direccion.length==0 || this.usuario.telefono.length==0 ?false:true
    this.formularioValido=resultado    
    return resultado
  }

}
