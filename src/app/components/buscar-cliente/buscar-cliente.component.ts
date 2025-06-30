import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Usuarios } from '../../Models/Entities.model';
import { SFacturasService } from '../../services/sfacturas.service';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrl: './buscar-cliente.component.scss'
})
export class BuscarClienteComponent implements OnInit {
  constructor(public sFacturas: SFacturasService) { }

  ngOnInit(): void {
    this.sFacturas.retornarUsuarios()
      .subscribe(
        respuesta => {
          if (respuesta.esCorrecto) {
            this.listaCompletaClientes = Object.values(respuesta.valor).filter((x:Usuarios)=>x.rolID==4);
            this.listaFiltradaClientes = this.listaCompletaClientes
          }else{
            console.log(respuesta.mensaje);
          }
        }
      )
  }

  @Output() cerrar = new EventEmitter<boolean>();
  @Output() clienteFacturar = new EventEmitter<Usuarios>();
  clienteSeleccionado?: Usuarios;
  seleccionBuscar: string = '1';
  listaCompletaClientes: Usuarios[] = []
  listaFiltradaClientes: Usuarios[] = [];
  filtro: string = ''
  buscarPorId:boolean=false
  p: number = 1;

  EnviarCliente(cliente: Usuarios) {
    this.clienteFacturar.emit(cliente);
  }

  BuscarClientes() {    
    if (this.buscarPorId) {
      this.listaFiltradaClientes = this.listaCompletaClientes.filter(x => x.usuarioID==parseInt(this.filtro))
    }else{
      this.listaFiltradaClientes = this.listaCompletaClientes.filter( 
      x=>x.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      x.usuarioID==parseInt(this.filtro) ||
      x.apellido.toLowerCase().includes(this.filtro.toLowerCase()) || 
      x.cedula.includes(this.filtro) || x.direccion.toLowerCase().includes(this.filtro.toLowerCase()) || 
      x.telefono.includes(this.filtro))
    }
  }
  AceptarCliente() {
    if (this.clienteSeleccionado) {
      this.EnviarCliente(this.clienteSeleccionado)
      this.cerrar.emit(false);
    } else {
      alert('Por favor debe seleccionar un cliente');
    }
  }

}
